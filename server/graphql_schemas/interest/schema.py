import graphene
from api.models import Interest
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from rest_framework.permissions import IsAuthenticated


class InterestNode(DjangoObjectType):
  class Meta:
    model = Interest
    filter_fields = {}
    interfaces = (relay.Node,)


# JoinSocialClub --> Mutation
# UnjoinSocialClub --> Mutation

class Mutation(relay.ClientIDMutation):
  def mutate_and_get_payload(self):
    pass

  pass


class Query(object):
  ####
  # Single Interest  --> Query
  interest = relay.Node.Field(InterestNode)
  # Interest List
  interests_list = DjangoFilterConnectionField(InterestNode)

  # Joined Club --> Query
  joined_clubs = graphene.List(InterestNode)
  user = graphene.Field(graphene.String)

  def resolve_joined_clubs(self, info):
    user = info.context.user
    return Interest.objects.filter(follower_id=user.id).all()
  def resolve_user(self, info):
    return  info.context.user
