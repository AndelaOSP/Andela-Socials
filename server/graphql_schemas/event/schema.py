import graphene
from api.models import Event, Category, Attend
from graphene import relay, InputObjectType, ObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


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

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, args, context, info):
        social_event_id = args.get('social_event_id')
        social_event = Category.objects.get(id=int(social_event_id))
        creator = info.context.user
        new_event = Event(
          title=args.get('title'),
          description=args.get('description'),
          venue=args.get('venue'),
          date=args.get('date'),
          time=args.get('time'),
          featured_image=args.get('featured_image'),
          creator=creator,
          social_event=social_event
        )
        new_event.save()

        return cls(new_event=new_event)

class Query(object):
  event = graphene.Field(EventNode,
                         id=graphene.Int(),
                         title=graphene.String())
  all_events = DjangoFilterConnectionField(EventNode)

  def resolve_event(self, info, **kwargs):
    id = kwargs.get('id')
    if id is not None:
      return Event.objects.get(pk=id)
    return None

class Mutation(ObjectType):
     create_event = CreateEvent.Field()
