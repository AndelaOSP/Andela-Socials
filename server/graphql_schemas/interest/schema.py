import graphene
from api.models import Interest, Category
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class InterestNode(DjangoObjectType):
  class Meta:
    model = Interest
    filter_fields = {}
    interfaces = (relay.Node,)


class JoinSocialClub(relay.ClientIDMutation):
  """Join a social club"""

  class Input:
    club_id = graphene.String(required=True)  # get the book id

  errors = graphene.List(graphene.String)
  joined_social_club = graphene.Field(InterestNode)

  @classmethod
  def mutate_and_get_payload(cls, args, context, info):
    club_id = args.get('club_id')
    user_category = Category.objects.get(id=club_id)
    user_interest = Interest(
      follower=info.context.user,
      follower_category=user_category
    )
    user_interest.save()

    return cls(joined_social_club=user_interest)


class UnJoinSocialClub(relay.ClientIDMutation):
  """Unsubscribe from a social club"""

  class Input:
    club_id = graphene.String(required=True)  # get the book id

  errors = graphene.List(graphene.String)
  unjoined_social_club = graphene.Field(InterestNode)

  @classmethod
  def mutate_and_get_payload(cls, args, context, info):
    club_id = args.get('club_id')
    user = info.context.user
    user_interest = Interest.objects.filter(
      follower_category_id=club_id,
      follower_id=user.id
    ).delete()
    user_interest.delete()

    return cls(unjoined_social_club=user_interest)


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


class Mutation(graphene.ObjectType):
  # JoinSocialClub --> Mutation
  join_social_club = JoinSocialClub.Field()

  # UnjoinSocialClub --> Mutation
  un_join_social_club = UnJoinSocialClub.Field()
