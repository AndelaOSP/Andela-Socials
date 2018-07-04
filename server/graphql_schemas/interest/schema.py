from api.models import Interest
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class InterestNode(DjangoObjectType):
  class Meta:
    model = Interest
    filter_fields = {}
    interfaces = (relay.Node,)


class Query(object):
  ####
  interest = relay.Node.Field(InterestNode)
  all_interests = DjangoFilterConnectionField(InterestNode)
