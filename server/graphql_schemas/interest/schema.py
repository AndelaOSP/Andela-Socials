import graphene

from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_relay import from_global_id

from api.models import Interest, Category


class InterestNode(DjangoObjectType):
  class Meta:
    model = Interest
    filter_fields = {}
    interfaces = (relay.Node,)


class JoinSocialClub(relay.ClientIDMutation):
  """Join a social club"""

  class Input:
    club_id = graphene.String(required=True)

  joined_social_club = graphene.Field(InterestNode)

  @classmethod
  def mutate_and_get_payload(cls, root, info, **input):
    club_id = input.get('club_id')
    user = info.context.user
    user_category = Category.objects.get(pk=from_global_id(club_id)[1])
    joined_social_club = Interest(
      follower=user,
      follower_category=user_category
    )
    joined_social_club.save()

    return JoinSocialClub(joined_social_club=joined_social_club)


class UnJoinSocialClub(relay.ClientIDMutation):
  """Unsubscribe from a social club"""

  class Input:
    club_id = graphene.String(required=True)  # get the book id

  unjoined_social_club = graphene.Field(InterestNode)

  @classmethod
  def mutate_and_get_payload(cls, root, info, **input):
    category = Category.objects.get(pk=from_global_id(input.get('club_id'))[1])
    user = info.context.user
    unjoined_social_club = Interest.objects.filter(
      follower_category_id=category.id,
      follower_id=user.id
    ).first()
    if not unjoined_social_club:
      raise GraphQLError("The User {0}, has not joined {1}. ".format(user, category))

    unjoined_social_club.delete()
    return UnJoinSocialClub(unjoined_social_club=unjoined_social_club)


class InterestQuery(object):
  interest = relay.Node.Field(InterestNode)
  interests_list = DjangoFilterConnectionField(InterestNode)

  joined_clubs = graphene.List(InterestNode)

  def resolve_joined_clubs(self, info):
    user = info.context.user
    return Interest.objects.filter(follower_id=user.id).all()


class InterestMutation(graphene.ObjectType):
  join_social_club = JoinSocialClub.Field()
  un_join_social_club = UnJoinSocialClub.Field()
