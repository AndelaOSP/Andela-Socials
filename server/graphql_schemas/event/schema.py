import graphene

from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from graphene import relay, ObjectType
from graphql_relay import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from api.models import Event, Category, AndelaUserProfile
from graphql_schemas.utils.helpers import (is_not_admin,
                                           update_instance,
                                           raise_calendar_error)
from graphql_schemas.utils.hasher import Hasher


class EventNode(DjangoObjectType):
    class Meta:
        model = Event
        filter_fields = {}
        interfaces = (relay.Node,)


class CreateEvent(relay.ClientIDMutation):
    class Input:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        venue = graphene.String(required=True)
        date = graphene.String(required=False)
        time = graphene.String(required=False)
        featured_image = graphene.String(required=False)
        social_event_id = graphene.String(required=True)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        social_event_id = from_global_id(input.pop('social_event_id'))[1]
        try:
            social_event = Category.objects.get(
                pk=social_event_id)
            user_profile = AndelaUserProfile.objects.get(
                user=info.context.user
            )
            if user_profile.credential:
                new_event = Event.objects.create(
                    **input,
                    creator=user_profile,
                    social_event=social_event
                )
            else:
                raise_calendar_error(user_profile)

        except ValueError as e:
            raise GraphQLError("An Error occurred. \n{}".format(e))

        return cls(new_event=new_event)


class UpdateEvent(relay.ClientIDMutation):

    class Input:
        title = graphene.String()
        description = graphene.String()
        venue = graphene.String()
        date = graphene.String()
        time = graphene.String()
        featured_image = graphene.String()
        social_event_id = graphene.String()
        event_id = graphene.String(required=True)

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
            if input.get("social_event_id"):
                input["social_event"] = Category.objects.get(
                    pk=from_global_id(input.get('social_event_id'))[1]
                )
            if event_instance:
                updated_event = update_instance(
                    event_instance,
                    input,
                    exceptions=["social_event_id", "event_id"]
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
        event_id = graphene.Int(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        event_id = input.get('event_id')
        event = Event.objects.get(id=event_id)
        if not event:
            raise GraphQLError('Invalid event')

        if user.id != event.creator.user_id and is_not_admin(user):
            raise GraphQLError("You aren't authorised to deactivate the event")

        Event.objects.filter(id=event_id).update(active=False)
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
                raise GraphQLError()
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
        except GraphQLError:
            return cls(
                isValid=False,
                message="Bad Request: Invalid invite URL"
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
