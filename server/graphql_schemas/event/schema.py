import graphene
from api.models import Event
from graphene import relay, InputObjectType, ObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class EventNode(DjangoObjectType):
  class Meta:
    model = Event
    filter_fields = {}
    interfaces = (relay.Node,)

class EventCreateInput(InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    venue = graphene.String(required=True)
    date = graphene.DateTime(required=True)
    time = graphene.DateTime(required=False)
    creator = graphene.String(required=False)
    social_event = graphene.String(required=False)
    featured_image = graphene.String(required=False)

class CreateEvent(relay.ClientIDMutation):

    class Input:
         event = graphene.Argument(EventCreateInput)

    new_event = graphene.Field(EventNode)

    @classmethod
    def mutate_and_get_payload(cls, args, context, info):

        event_data = args.get('event')
        # unpack the dict item into the model instance
        new_event = Event.objects.create(**event_data)
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
