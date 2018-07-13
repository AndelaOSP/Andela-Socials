import graphene

from graphene import relay, ObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql_relay import from_global_id
from graphql import GraphQLError

from api.models import Event, Category, AndelaUserProfile
from graphql_schemas.utils.helpers import is_not_admin


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
        user = info.context.user
        social_event_id = input.get('social_event_id')
        social_event = Category.objects.get(
            id=from_global_id(social_event_id)[1])
        user = info.context.user
        googleUser = GoogleUser.objects.first()
        new_event = Event(
            title=input.get('title'),
            description=input.get('description'),
            venue=input.get('venue'),
            date=input.get('date'),
            time=input.get('time'),
            featured_image=input.get('featured_image'),
            creator=googleUser,
            social_event=social_event
        )
        new_event.save()

        return cls(new_event=new_event)


class UpdateEvent(relay.ClientIDMutation):

    class Input:
        title = graphene.String()
        description = graphene.String()
        venue = graphene.String()
        date = graphene.String()
        time = graphene.String()
        featured_image = graphene.String()
        social_event_id = graphene.Int()
        event_id = graphene.String(required=True)

    updated_event = graphene.Field(EventNode)

    def update_instance(instance, args, exceptions=['event_id']):
        if instance:
            [setattr(instance, key, value)
             for key, value in args.items() if key not in exceptions]
        instance.save()
        return instance

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):

        try:
            event_instance = Event.objects.get(
                id=from_global_id(input.get('event_id'))[1]
                )
            if event_instance:
                updated_event = cls.update_instance(
                    event_instance, input)
                return UpdateEvent(updated_event=updated_event)
        except ValueError as e:
            # return an error if something wrong happens
            raise GraphQLError("{}".format(e))


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


class EventMutation(ObjectType):
    create_event = CreateEvent.Field()
    deactivate_event = DeactivateEvent.Field()
