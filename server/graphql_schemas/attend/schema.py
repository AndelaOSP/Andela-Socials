import graphene
from api.models import Attend
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class AttendNode(DjangoObjectType):
  class Meta:
    model = Attend
    filter_fields = {}
    interfaces = (relay.Node,)


class Query(object):
  ####
  attending = relay.Node.Field(AttendNode)
  all_attenders = DjangoFilterConnectionField(AttendNode)
  my_subscribed_events = graphene.List(AttendNode)

  def resolve_my_subscribed_events(self, info, **kwargs):
    id = kwargs.get('id')
    return Attend.objects.filter(user_id=id).all()
