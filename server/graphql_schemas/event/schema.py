import graphene
from api.models import Event
from graphene import relay, InputObjectType
from graphql_relay.node.node import from_global_id
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class EventNode(DjangoObjectType):
  class Meta:
    model = Event
    filter_fields = {}
    interfaces = (relay.Node,)


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


