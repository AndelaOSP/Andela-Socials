import graphene
import logging
import dotenv

from dateutil.parser import parse
from django.forms.models import model_to_dict

from django.core.mail import EmailMessage
from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import get_template
from django.utils import timezone
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
                                           not_valid_timezone)
from graphql_schemas.scalars import NonEmptyString
from graphql_schemas.utils.hasher import Hasher
from api.models import (Event, Category, AndelaUserProfile,
                        Interest, Attend)
from api.slack import (get_slack_id,
                       notify_user,
                       new_event_message,
                       get_slack_channels_list, notify_channel)
from api.utils.backgroundTaskWorker import BackgroundTaskWorker

from ..attend.schema import AttendNode

logging.basicConfig(
    filename='warning.log',
    level=logging.DEBUG,
    format='%(asctime)s %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')


class EventNode(DjangoObjectType):
    attendSet = AttendNode()

    def resolve_attendSet(self, info, **kwargs):
        return self.attendSet.filter(status="attending")

    class Meta:
        model = Event
        filter_fields = {'start_date': ['exact', 'istartswith'],
                         'social_event': ['exact'], 'venue': ['exact'],
                         'title': ['exact', 'istartswith']}
        interfaces = (relay.Node,)


class CreateEvent(relay.ClientIDMutation):
    class Input:
        title = NonEmptyString(required=True)
        description = NonEmptyString(required=True)
        venue = NonEmptyString(required=True)
        start_date = graphene.DateTime(required=True)
        end_date = graphene.DateTime(required=True)
        featured_image = graphene.String(required=True)
        category_id = graphene.ID(required=True)
        timezone = graphene.String(required=False)

    new_event = graphene.Field(EventNode)

    @staticmethod
    def create_event(category, user_profile, **input):
        is_date_valid = validate_event_dates(input)
        if not is_date_valid.get('status'):
            raise GraphQLError(is_date_valid.get('message'))
        if not input.get('timezone'):
            input['timezone'] = user_profile.timezone
        if not_valid_timezone(input.get('timezone')):
            return GraphQLError("Timezone is invalid")

        new_event = Event.objects.create(
            **input,
            creator=user_profile,
            social_event=category
        )
        new_event.save()
        return new_event

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        category_id = from_global_id(input.pop('category_id'))[1]
        try:
            category = Category.objects.get(
                pk=category_id)
            user_profile = AndelaUserProfile.objects.get(
                user=info.context.user
            )
            new_event = CreateEvent.create_event(
                category, user_profile, **input)
            if user_profile.credential and user_profile.credential.valid:
                # Send calender invite in background
                BackgroundTaskWorker.start_work(send_calendar_invites,
                                                (user_profile, new_event))
            else:
                CreateEvent.notify_event_in_slack(category, input, new_event)
                raise_calendar_error(user_profile)

        except ValueError as e:
            raise GraphQLError("An Error occurred. \n{}".format(e))

        CreateEvent.notify_event_in_slack(category, input, new_event)
        return cls(new_event=new_event)

    @staticmethod
    def notify_event_in_slack(category, input, new_event):
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
                    slack_response = notify_user(
                        blocks, instance.follower.slack_id,
                        text="New upcoming event from Andela socials")
                    if not slack_response['ok']:
                        logging.warn(slack_response)
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
                        slack_response = notify_user(
                            blocks, retrieved_slack_id)
                        if not slack_response['ok']:
                            logging.warn(slack_response)
                    else:
                        continue
        except BaseException as e:
            logging.warn(e)


class UpdateEvent(relay.ClientIDMutation):

    class Input:
        title = graphene.String()
        description = graphene.String()
        venue = graphene.String()
        start_date = graphene.DateTime()
        end_date = graphene.DateTime()
        featured_image = graphene.String()
        timezone = graphene.String()
        category_id = graphene.ID()
        event_id = graphene.ID(required=True)

    updated_event = graphene.Field(EventNode)
    action_message = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        try:
            user = AndelaUserProfile.objects.get(user=info.context.user)
            event_instance = Event.objects.get(
                pk=from_global_id(input.get('event_id'))[1]
            )
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
                return cls(
                    action_message="Event Update is successful.",
                    updated_event=updated_event
                )
        except ValueError as e:
            # return an error if something wrong happens
            raise GraphQLError("An Error occurred. \n{}".format(e))


class DeactivateEvent(relay.ClientIDMutation):
    action_message = graphene.String()

    class Input:
        event_id = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        event_id = input.get('event_id')
        db_event_id = from_global_id(event_id)[1]
        event = Event.objects.get(id=db_event_id)
        if not event:
            raise GraphQLError('Invalid event')

        if user.id != event.creator.user_id and is_not_admin(user):
            raise GraphQLError("You aren't authorised to deactivate the event")

        Event.objects.filter(id=db_event_id).update(active=False)
        return cls(action_message="Event deactivated")


class SendEventInvite(relay.ClientIDMutation):
    message = graphene.String()

    class Input:
        event_id = graphene.ID(required=True)
        receiver_email = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
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
    isValid = graphene.Boolean()
    event = graphene.Field(EventNode)
    message = graphene.String()

    class Input:
        hash_string = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
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
    unlinked = graphene.String()
    is_im = graphene.Boolean()
    is_mpim = graphene.Boolean()
    is_group = graphene.Boolean()
    members = graphene.List(graphene.String)
    previous_names = graphene.List(graphene.String)
    num_members = graphene.Int()
    parent_conversation = graphene.String()
    is_pending_ext_shared = graphene.Boolean()
    pending_shared = graphene.List(graphene.Boolean)
    is_ext_shared = graphene.Boolean()


class ResponseMetadata(graphene.ObjectType):
    next_cursor = graphene.String()


class SlackChannelsList(graphene.ObjectType):
    ok = graphene.Boolean()
    channels = graphene.List(ChannelList)
    response_metadata = graphene.Field(ResponseMetadata)

    class Meta:
        interfaces = (relay.Node,)


class ShareEvent(relay.ClientIDMutation):
    class Input:
        event_id = graphene.ID()
        channel_id = graphene.String()

    event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
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
            raise GraphQLError("An Error occurred. Please try again")

        return ShareEvent(event=event)


class EventQuery(object):
    event = relay.Node.Field(EventNode)
    events_list = DjangoFilterConnectionField(EventNode)
    slack_channels_list = graphene.Field(SlackChannelsList)

    def resolve_event(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            event = Event.objects.get(pk=id)
            if not event.active:
                return None
            return event
        return None

    def resolve_events_list(self, info, **kwargs):
        return Event.objects.exclude(active=False)

    def resolve_slack_channels_list(self, info, **kwargs):
        channels = []
        slack_list = get_slack_channels_list()
        responseMetadata = ResponseMetadata(**slack_list.get('response_metadata'))
        for items in slack_list.get('channels'):
            selection = ['topic', 'purpose', 'shared_team_ids']
            filtered_channel = dict(filter(lambda x: x[0] not in selection, items.items()))
            channel = ChannelList(**filtered_channel)
            channels.append(channel)
        return SlackChannelsList(
            ok=slack_list.get('ok'),channels=channels,response_metadata=responseMetadata)


class EventMutation(ObjectType):
    create_event = CreateEvent.Field()
    deactivate_event = DeactivateEvent.Field()
    send_event_invite = SendEventInvite.Field()
    update_event = UpdateEvent.Field()
    validate_event_invite = ValidateEventInvite.Field()
    share_event = ShareEvent.Field()
