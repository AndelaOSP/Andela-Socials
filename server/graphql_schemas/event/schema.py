import graphene
import logging

from django.forms.models import model_to_dict

from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from graphene import relay, ObjectType
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from graphql_schemas.utils.helpers import (is_not_admin,
                                           update_instance,
                                           send_calendar_invites,
                                           raise_calendar_error,
                                           not_valid_timezone)
from graphql_schemas.utils.hasher import Hasher
from api.models import Event, Category, AndelaUserProfile, \
    Interest, Attend
from api.slack import get_slack_id, notify_user

from api.utils.backgroundTaskWorker import BackgroundTaskWorker

logging.basicConfig(
    filename='warning.log',
    level=logging.DEBUG,
    format='%(asctime)s %(message)s',
    datefmt='%m/%d/%Y %I:%M:%S %p')


class EventNode(DjangoObjectType):
    class Meta:
        model = Event
        filter_fields = ['start_date', 'social_event', 'venue']
        interfaces = (relay.Node,)


class CreateEvent(relay.ClientIDMutation):
    class Input:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        venue = graphene.String(required=True)
        start_date = graphene.DateTime(required=True)
        end_date = graphene.DateTime(required=True)
        featured_image = graphene.String(required=False)
        category_id = graphene.ID(required=True)
        timezone = graphene.String(required=False)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        category_id = from_global_id(input.pop('category_id'))[1]
        try:
            category = Category.objects.get(
                pk=category_id)
            user_profile = AndelaUserProfile.objects.get(
                user=info.context.user
            )
            if user_profile.credential and user_profile.credential.valid:
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

                # Send calender invite in background
                BackgroundTaskWorker.start_work(send_calendar_invites,
                                                (user_profile, new_event))
            else:
                raise_calendar_error(user_profile)

        except ValueError as e:
            raise GraphQLError("An Error occurred. \n{}".format(e))

        try:
            CreateEvent.notify_event_in_slack(category, input, new_event)
        except BaseException as e:
            logging.warn(e)

        return cls(new_event=new_event)

    @staticmethod
    def notify_event_in_slack(category, input, new_event):
        category_followers = Interest.objects.filter(
            follower_category_id=category.id)
        message = (f"A new event has been created in {category.name} "
                   f"group \n Title: {input.get('title')} \n"
                   f"Description: {input.get('description')} \n "
                   f"Venue: {input.get('venue')} \n"
                   f"Date: {input.get('date')} \n Time: {input.get('time')}")
        slack_id_not_in_db = []
        all_users_attendance = []
        for instance in category_followers:
            new_attendance = Attend(user=instance.follower, event=new_event)
            all_users_attendance.append(new_attendance)
            if instance.follower.slack_id:
                slack_response = notify_user(
                    message, instance.follower.slack_id)
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
                    slack_response = notify_user(message, retrieved_slack_id)
                    if not slack_response['ok']:
                        logging.warn(slack_response)
                else:
                    continue


class UpdateEvent(relay.ClientIDMutation):

    class Input:
        title = graphene.String()
        description = graphene.String()
        venue = graphene.String()
        startDate = graphene.DateTime()
        endDate = graphene.DateTime()
        featured_image = graphene.String()
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
            Event.objects.get(id=from_global_id(event_id)[1])
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

        hashes = Hasher.gen_hash([
            event_id, receiver.user.id, sender.user.id])
        invite_url = info.context.build_absolute_uri(
            f"/invite/{hashes}")
        message = f"Click on this link to view invite\n\n{invite_url}"

        sent = send_mail(
            f"You have been invited to an event by {sender.user.username}",
            message,
            None,
            [receiver_email]
        )

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
            if data and len(data) == 3:
                event_id, receiver_id, sender_id = data
                event = Event.objects.get(id=event_id)
                AndelaUserProfile.objects.get(user_id=sender_id)
                assert user_id == receiver_id
                return cls(
                    isValid=True, event=event,
                    message="OK: Event invite is valid")
            else:
                raise GraphQLError("Bad Request: Invalid invite URL")
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


class EventQuery(object):
    event = relay.Node.Field(EventNode)
    events_list = DjangoFilterConnectionField(EventNode)

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


class EventMutation(ObjectType):
    create_event = CreateEvent.Field()
    deactivate_event = DeactivateEvent.Field()
    send_event_invite = SendEventInvite.Field()
    update_event = UpdateEvent.Field()
    validate_event_invite = ValidateEventInvite.Field()
