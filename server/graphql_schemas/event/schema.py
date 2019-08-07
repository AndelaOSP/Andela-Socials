import graphene
import logging
import dotenv
import iso8601

from dateutil.parser import parse
from django.forms.models import model_to_dict

from django.core.mail import EmailMessage
from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import get_template
from django.utils import timezone
from django_filters import FilterSet, CharFilter
from graphene import relay, ObjectType
from graphql_relay import from_global_id, to_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from graphql_schemas.utils.helpers import (is_not_admin,
                                           update_instance,
                                           send_calendar_invites,
                                           validate_event_dates,
                                           raise_calendar_error,
                                           not_valid_timezone,
                                           send_bulk_update_message,
                                           add_event_to_calendar,
                                           remove_event_from_all_calendars)
from graphql_schemas.scalars import NonEmptyString
from graphql_schemas.utils.hasher import Hasher
from api.models import (Event, Category, AndelaUserProfile,
                        Interest, Attend, RecurrenceEvent)
from api.slack import (get_slack_id,
                       notify_user,
                       new_event_message,
                       get_slack_channels_list, notify_channel)
from api.utils.backgroundTaskWorker import BackgroundTaskWorker

from api.constants import SLACK_CHANNEL_DATA

from ..attend.schema import AttendNode

logging.basicConfig(
    filename='warning.log',
    level=logging.DEBUG,
    format='%(asctime)s %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')


class EventFilter(FilterSet):
    """
        Handles the filtering of events
    """
    creator = CharFilter(method='user_profile')

    def user_profile(self, queryset, name, value):
        """
        Gets the events created by a user
        Params:
            queryset(dict): the queryset to filter
            name(dict): the name of the user
            value(dict): the google id
        Returns:
            filter the event  based on the user
        """
        try:
            user_profile = AndelaUserProfile.objects.get(
                google_id=value
            )
        except AndelaUserProfile.DoesNotExist:
            raise GraphQLError(
                "AndelaUserProfile does not exist")

        return queryset.filter(creator=user_profile)

    class Meta:
        model = Event
        fields = {'start_date': ['exact', 'istartswith'],
                  'social_event': ['exact'], 'venue': ['exact'],
                  'title': ['exact', 'istartswith'], 'creator': ['exact']}

class EventNode(DjangoObjectType):
    attendSet = AttendNode()

    def resolve_attendSet(self, info, **kwargs):
        return self.attendSet.filter(status="attending")

    class Meta:
        model = Event
        filter_fields = {'start_date': ['exact', 'istartswith'],
                         'social_event': ['exact'], 'venue': ['exact'],
                         'title': ['exact', 'istartswith'], 'creator': ['exact']}
        interfaces = (relay.Node,)


class Frequency(graphene.Enum):
    Daily = "DAILY"
    Weekly = "WEEKLY"
    Monthly = "MONTHLY"


class CreateEvent(relay.ClientIDMutation):
    """
        Handles the creation of events
    """
    class Input:
        title = NonEmptyString(required=True)
        description = NonEmptyString(required=True)
        venue = NonEmptyString(required=True)
        start_date = graphene.DateTime(required=True)
        end_date = graphene.DateTime(required=True)
        featured_image = graphene.String(required=True)
        category_id = graphene.ID(required=True)
        timezone = graphene.String(required=False)
        slack_channel = graphene.String(required=False)
        frequency = Frequency()
        recurring = graphene.Boolean(required=False)
        recurrence_end_date = graphene.DateTime(required=False)

    new_event = graphene.Field(EventNode)
    slack_token = graphene.Boolean()

    @staticmethod
    def create_event(category, user_profile, recurrence_event, **input):
        """
        create an event
        Params:
            category(str): the category of the event
            user_profile(dict): the profile of the user
            recurrence_event(bool): to indicate if event is reoccuring
        Returns:
            create the new event
        """
        is_date_valid = validate_event_dates(input, 'event_date')
        if not is_date_valid.get('status'):
            raise GraphQLError(is_date_valid.get('message'))
        if not input.get('timezone'):
            input['timezone'] = user_profile.timezone
        if not_valid_timezone(input.get('timezone')):
            return GraphQLError("Timezone is invalid")

        input.pop('recurring', None)
        input.pop('frequency', None)
        new_event = Event.objects.create(
            **input,
            creator=user_profile,
            social_event=category,
            recurrence=recurrence_event
        )
        new_event.save()
        return new_event

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        calls the create event mutations
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns the event created
        """
        category_id = from_global_id(input.pop('category_id'))[1]
        recurrence_event = None
        try:
            category = Category.objects.get(
                pk=category_id)
            user_profile = AndelaUserProfile.objects.get(
                user=info.context.user
            )
            if input.get('recurring'):
                recurrence_event = cls.create_recurrent_event(**input)
            input.pop('recurrence_end_date', None)
            new_event = CreateEvent.create_event(
                category, user_profile, recurrence_event, **input)

            args_dict = {
                "new_event": new_event,
                "recurrence_event": recurrence_event,
                "user_profile": user_profile
            }
            cls.start_background_task(**args_dict)
            CreateEvent.notify_event_in_slack(category, input, new_event)

        except ValueError as e:
            logging.warn(e)
            raise GraphQLError("An Error occurred. Please try again")

        slack_token = False
        if user_profile.slack_token:
            slack_token = True
        CreateEvent.notify_event_in_slack(category, input, new_event)
        return cls(
            slack_token=slack_token,
            new_event=new_event
        )

    @classmethod
    def start_background_task(cls, new_event, recurrence_event, user_profile):
        """
        start background task to add event to calendar
        Params:
            new_event(dict): the new event to be created
            recurrence_event(bool): reoccuring event
            user_profile(dict): user profile
        Returns:
            run the addevent function as background task
        """
        if recurrence_event:
            BackgroundTaskWorker.start_work(add_event_to_calendar,
                                            (user_profile, new_event, True))
        else:
            BackgroundTaskWorker.start_work(add_event_to_calendar,
                                            (user_profile, new_event))

    @staticmethod
    def create_recurrent_event(**input):
        """
        creates the recurrent event
        Params:
            input(dict): the input
        Returns:
            create the re-occuring event
        """
        frequency = input.get('frequency')
        start_date = input.get('start_date')
        end_date = input.get('recurrence_end_date')
        is_date_valid = validate_event_dates(input, 'recurrent_date')
        if not is_date_valid.get('status'):
            raise GraphQLError(is_date_valid.get('message'))

        recurrence_event = RecurrenceEvent.objects.create(
            frequency=frequency,
            start_date=start_date,
            end_date=end_date
            )
        return recurrence_event

    @staticmethod
    def notify_event_in_slack(category, input, new_event):
        """
        notify user on new event
        Params:
            category(dict): the category of the event
            input(dict): the inputs
            new_event(dict): the new event
        Returns:
            notify the users on new event
        """
        try:
            category_followers = Interest.objects.filter(
                follower_category_id=category.id)
            event_id = to_global_id(EventNode._meta.name, new_event.id)
            event_url = f"{dotenv.get('FRONTEND_BASE_URL')}/{event_id}"
            message = (f"*A new event has been created in `{category.name}` group*\n"
                       f"> *Title:* {input.get('title')}\n"
                       f"> *Description:* {input.get('description')}\n"
                       f"> *Venue:* {input.get('venue')}\n"
                       f"> *Date:*  {input.get('start_date').date()}\n"
                       f"> *Time:*  {input.get('start_date').time()}")
            blocks = new_event_message(
                message, event_url, str(new_event.id), input.get('featured_image'))
            slack_id_not_in_db = []
            all_users_attendance = []
            for instance in category_followers:
                new_attendance = Attend(
                    user=instance.follower, event=new_event)
                all_users_attendance.append(new_attendance)
                if instance.follower.slack_id:
                    text = "New upcoming event from Andela socials"
                    BackgroundTaskWorker.start_work(
                        notify_user, (
                            blocks,
                            instance.follower.slack_id,
                            text
                        )
                    )
                else:
                    slack_id_not_in_db.append(instance)
            Attend.objects.bulk_create(all_users_attendance)

            if slack_id_not_in_db:
                for instance in slack_id_not_in_db:
                    retrieved_slack_id = get_slack_id(
                        model_to_dict(instance.follower.user))
                    if retrieved_slack_id != '':
                        instance.follower.slack_id = retrieved_slack_id
                        instance.follower.save()
                        text = "New upcoming event from Andela socials"
                        BackgroundTaskWorker.start_work(
                            notify_user, (blocks, retrieved_slack_id, text))
                    else:
                        continue
        except BaseException as e:
            logging.warn(e)


class UpdateEvent(relay.ClientIDMutation):
    """
        Handle updating events
    """
    class Input:
        """
         inputs send by the user
        """
        title = graphene.String()
        description = graphene.String()
        venue = graphene.String()
        start_date = graphene.DateTime()
        end_date = graphene.DateTime()
        featured_image = graphene.String()
        timezone = graphene.String()
        category_id = graphene.ID()
        slack_channel = graphene.String(required=False)
        event_id = graphene.ID(required=True)

    updated_event = graphene.Field(EventNode)
    action_message = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        Update an event
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns the updated event
        """
        try:
            user = AndelaUserProfile.objects.get(user=info.context.user)
            event_instance = Event.objects.get(
                pk=from_global_id(input.get('event_id'))[1]
            )

            old_venue = event_instance.venue
            old_start_date = iso8601.parse_date(event_instance.start_date)
            old_end_date = iso8601.parse_date(event_instance.end_date)

            if event_instance.creator != user \
                    and not info.context.user.is_superuser:
                raise GraphQLError(
                    "You are not authorized to edit this event.")
            if input.get("category_id"):
                input["social_event"] = Category.objects.get(
                    pk=from_global_id(input.get('category_id'))[1]
                )
            if event_instance:
                updated_event = update_instance(
                    event_instance,
                    input,
                    exceptions=["category_id", "event_id"]
                )
                new_venue = updated_event.venue
                new_start_date = updated_event.start_date
                new_end_date = updated_event.end_date
                message_content = ''
                if old_venue != new_venue:
                    message_content += (f"> *Former Venue:* {old_venue}\n"
                                        f"> *New Venue:*  {new_venue}\n\n")

                if old_start_date != new_start_date or old_end_date != new_end_date:
                    message_content += (f"> *Former Date:*  {old_start_date.date()} {old_start_date.time()}\n"
                                        f"> *New Date:*  {new_start_date.date()} {new_start_date.time()}")

                if message_content:
                    message = f"The following details about the *{event_instance.title}* event has been changed\n"
                    message += message_content

                    BackgroundTaskWorker.start_work(
                        send_bulk_update_message, (event_instance, message, "An event you are attending was updated"))

                return cls(
                    action_message="Event Update is successful.",
                    updated_event=updated_event
                )
        except Exception as e:
            # return an error if something wrong happens
            logging.warn(e)
            raise GraphQLError("An Error occurred. Please try again")


class DeactivateEvent(relay.ClientIDMutation):
    action_message = graphene.String()

    class Input:
        event_id = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        Deactivates an event
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns deactivation message
        """
        user = info.context.user
        event_id = input.get('event_id')
        db_event_id = from_global_id(event_id)[1]
        event = Event.objects.get(id=db_event_id)
        if not event:
            raise GraphQLError('Invalid event')

        if user.id != event.creator.user_id and is_not_admin(user):
            raise GraphQLError("You aren't authorised to deactivate the event")

        Event.objects.filter(id=db_event_id).update(active=False)

        message = f"The *{event.title}* event has been cancelled\n"
        andela_user = AndelaUserProfile.objects.get(
            user_id=user.id)
        BackgroundTaskWorker.start_work(
            remove_event_from_all_calendars, (andela_user, event))

        BackgroundTaskWorker.start_work(
            send_bulk_update_message, (event, message, "An event you are attending has been cancelled"))

        return cls(action_message="Event deactivated")


class SendEventInvite(relay.ClientIDMutation):
    message = graphene.String()

    class Input:
        event_id = graphene.ID(required=True)
        receiver_email = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        sends event invites to user
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            event message
        """
        event_id = input.get('event_id')
        sender = AndelaUserProfile.objects.get(
            user_id=info.context.user.id)
        receiver_email = input.get('receiver_email')

        try:
            receiver = AndelaUserProfile.objects.get(
                user__email=receiver_email)
            event = Event.objects.get(id=from_global_id(event_id)[1])
            assert sender.user.id != receiver.user.id
        except AndelaUserProfile.DoesNotExist:
            raise GraphQLError(
                "Recipient User does not exist")
        except Event.DoesNotExist:
            raise GraphQLError(
                "Event does not exist")
        except AssertionError:
            raise GraphQLError(
                "User cannot invite self")

        invite_hash = Hasher.gen_hash([
            event.id, receiver.user.id, sender.user.id])
        invite_url = info.context.build_absolute_uri(
            f"/invite/{invite_hash}")
        data_values = {
            'title': event.title,
            'imgUrl': event.featured_image,
            'venue': event.venue,
            'startDate': event.start_date,
            'url': invite_url
        }
        message = get_template('event_invite.html').render(data_values)
        msg = EmailMessage(
            f"You have been invited to an event by {sender.user.username}",
            message,
            to=[receiver_email]
        )
        msg.content_subtype = 'html'
        sent = msg.send()

        if sent:
            return cls(message="Event invite delivered")
        else:
            raise GraphQLError("Event invite not delivered")


class ValidateEventInvite(relay.ClientIDMutation):
    """
    validate the event invites
    """
    isValid = graphene.Boolean()
    event = graphene.Field(EventNode)
    message = graphene.String()

    class Input:
        hash_string = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        checks if event is valid
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            return the necessary message if event is valid or not
        """
        hash_string = input.get('hash_string')
        user_id = info.context.user.id
        try:
            data = Hasher.reverse_hash(hash_string)
            if not data or len(data) != 3:
                raise GraphQLError("Bad Request: Invalid invite URL")
            event_id, receiver_id, sender_id = data
            assert user_id == receiver_id
            event = Event.objects.get(id=event_id)
            if timezone.now() > parse(event.end_date):
                raise GraphQLError("Expired Invite: Event has ended")
            AndelaUserProfile.objects.get(user_id=sender_id)
            return cls(
                isValid=True, event=event,
                message="OK: Event invite is valid")
        except AssertionError:
            return cls(
                isValid=False,
                message="Forbidden: Unauthorized access"
            )
        except ObjectDoesNotExist:
            return cls(
                isValid=False,
                message="Not Found: Invalid event/user in invite"
            )
        except GraphQLError as err:
            return cls(
                isValid=False,
                message=str(err)
            )


class ChannelList(graphene.ObjectType):
    """
    Slack group channel list data
    """
    id = graphene.ID()
    name = graphene.String()
    is_channel = graphene.String()
    created = graphene.Int()
    creator = graphene.String()
    is_archived = graphene.Boolean()
    is_general = graphene.Boolean()
    name_normalized = graphene.String()
    is_shared = graphene.Boolean()
    is_org_shared = graphene.Boolean()
    is_member = graphene.Boolean()
    is_private = graphene.Boolean()
    is_group = graphene.Boolean()
    members = graphene.List(graphene.String)


class ResponseMetadata(graphene.ObjectType):
    """
    response meta data
    """
    next_cursor = graphene.String()


class SlackChannelsList(graphene.ObjectType):
    """
    handles slack channel list
    """
    ok = graphene.Boolean()
    channels = graphene.List(ChannelList)
    response_metadata = graphene.Field(ResponseMetadata)

    class Meta:
        interfaces = (relay.Node,)


class ShareEvent(relay.ClientIDMutation):
    """
    Handles event sharing on the channel
    """
    class Input:
        event_id = graphene.ID()
        channel_id = graphene.String()

    event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        share event on the channel
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            post event on the necessary channel
        """
        event_id = from_global_id(input.get('event_id'))[1]
        channel_id = input.get('channel_id')
        event_url = f"{dotenv.get('FRONTEND_BASE_URL')}/{event_id}"
        event = Event.objects.get(pk=event_id)

        try:
            start_date = parse(event.start_date)
            message = (f"*A new event has been created by <@{event.creator.slack_id}>.*\n"
                       f"> *Title:* {event.title}\n"
                       f"> *Description:* {event.description}\n"
                       f"> *Venue:* {event.venue}\n"
                       f"> *Date:*  {start_date.strftime('%d %B %Y, %A')} \n"
                       f"> *Time:*  {start_date.strftime('%H:%M')}")
            blocks = new_event_message(
                message, event_url, event_id, event.featured_image)

            notify_channel(
                blocks, "New upcoming event from Andela socials", channel_id)

        except ValueError as e:
            logging.warn(e)
            raise GraphQLError("An Error occurred. Please try again")

        return ShareEvent(event=event)


class EventQuery(object):
    event = relay.Node.Field(EventNode)
    events_list = DjangoFilterConnectionField(EventNode, filterset_class=EventFilter)
    slack_channels_list = graphene.Field(SlackChannelsList)

    def resolve_event(self, info, **kwargs):
        """
        resolve event and return event that is gotten with the event id
        Params:
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns the event or none if no event
        """
        id = kwargs.get('id')

        if id is not None:
            event = Event.objects.get(pk=id)
            if not event.active:
                return None
            return event
        return None

    def resolve_events_list(self, info, **kwargs):
        """
        resolve all event and return all event
        Params:
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns all event
        """
        return Event.objects.exclude(active=False)

    def resolve_slack_channels_list(self, info, **kwargs):
        """
        resolve slack channel
        Params:
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            returns all channels
        """
        channels = []
        slack_list = get_slack_channels_list()
        responseMetadata = ResponseMetadata(**slack_list.get('response_metadata'))
        for items in slack_list.get('channels'):
            selection = SLACK_CHANNEL_DATA
            filtered_channel = dict(filter(lambda x: x[0] in selection, items.items()))
            channel = ChannelList(**filtered_channel)
            channels.append(channel)
        return SlackChannelsList(
            ok=slack_list.get('ok'), channels=channels, response_metadata=responseMetadata)


class EventMutation(ObjectType):
    """
    Handles event mutations
    """
    create_event = CreateEvent.Field()
    deactivate_event = DeactivateEvent.Field()
    send_event_invite = SendEventInvite.Field()
    update_event = UpdateEvent.Field()
    validate_event_invite = ValidateEventInvite.Field()
    share_event = ShareEvent.Field()
