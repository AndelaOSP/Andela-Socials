import graphene
from api.models import Interest, Category
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql_relay import from_global_id


class InterestNode(DjangoObjectType):
  class Meta:
    model = Interest
    filter_fields = {}
    interfaces = (relay.Node,)


class JoinSocialClub(relay.ClientIDMutation):
  """Join a social club"""

  class Input:
    club_id = graphene.String(required=True)  # get the book id

  joined_social_club = graphene.Field(InterestNode)

  @classmethod
  def mutate_and_get_payload(cls, root, info, **input):
    club_id = input.get('club_id')
    user_category = Category.objects.get(pk=from_global_id(club_id)[1])
    joined_social_club = Interest(
      follower=info.context.user,
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
    club_id = from_global_id(input.get('club_id'))[1]
    user = info.context.user
    unjoined_social_club = Interest.objects.filter(
      follower_category_id=club_id,
      follower_id=user.id
    ).delete()
    unjoined_social_club.delete()

    return cls(unjoined_social_club=unjoined_social_club)


class Query(object):
  ####
  # Single Interest  --> Query
  interest = relay.Node.Field(InterestNode)
  # Interest List
  interests_list = DjangoFilterConnectionField(InterestNode)

  # Joined Club --> Query
  joined_clubs = graphene.List(InterestNode)

  def resolve_joined_clubs(self, info):
    user = info.context.user
    return Interest.objects.filter(follower_id=user.id).all()


class Mutation(graphene.ObjectType):
  # JoinSocialClub --> Mutation
  join_social_club = JoinSocialClub.Field()

  # UnjoinSocialClub --> Mutation
  un_join_social_club = UnJoinSocialClub.Field()
