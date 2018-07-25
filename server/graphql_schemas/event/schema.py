import graphene

from graphene import relay, ObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError

from api.models import Event, Category, AndelaUserProfile
from graphql_schemas.utils.helpers import (is_not_admin,
                                           update_instance,
                                           raise_calendar_error)


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
        date = graphene.String(required=True)
        time = graphene.String(required=False)
        featured_image = graphene.String(required=False)
        social_event_id = graphene.String(required=False)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        social_event_id = input.get('social_event_id')
        try:
            social_event = Category.objects.get(
                id=from_global_id(social_event_id)[1])
            user_profile = AndelaUserProfile.objects.get(
                user=info.context.user
            )
            if user_profile.credential:
                new_event = Event(
                    title=input.get('title'),
                    description=input.get('description'),
                    venue=input.get('venue'),
                    date=input.get('date'),
                    time=input.get('time'),
                    featured_image=input.get('featured_image'),
                    creator=user_profile,
                    social_event=social_event
                )
                new_event.save()
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
    update_event = UpdateEvent.Field()
