import graphene

from graphene import relay, InputObjectType, ObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from api.models import Event, Category, Attend, AndelaUserProfile


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
        social_event_id = graphene.Int(required=False)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        social_event_id = input.get('social_event_id')
        social_event = Category.objects.get(id=int(social_event_id))
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        new_event = Event(
          title=input.get('title'),
          description=input.get('description'),
          venue=input.get('venue'),
          date=input.get('date'),
          time=input.get('time'),
          featured_image=input.get('featured_image'),
          creator=andela_user_profile,
          social_event=social_event
        )
        new_event.save()

        return cls(new_event=new_event)


class EventQuery(object):
    event = graphene.Field(EventNode,
                           id=graphene.Int(),
                           title=graphene.String())
    events_list = DjangoFilterConnectionField(EventNode)

    def resolve_event(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Event.objects.get(pk=id)
        return None


class EventMutation(ObjectType):
     create_event = CreateEvent.Field()
