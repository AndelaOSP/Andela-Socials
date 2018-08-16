import graphene

from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_relay import from_global_id

from api.models import Interest, Category, AndelaUserProfile


class InterestNode(DjangoObjectType):
    class Meta:
        model = Interest
        filter_fields = {}
        interfaces = (relay.Node,)


class JoinCategory(relay.ClientIDMutation):
    """Join a category"""
    class Input:
        category_id = graphene.ID(required=True)

    joined_category = graphene.Field(InterestNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        category_id = input.get('category_id')
        user = AndelaUserProfile.objects.get(user=info.context.user)
        user_category = Category.objects.get(pk=from_global_id(category_id)[1])
        joined_category = Interest(
            follower=user,
            follower_category=user_category
        )
        joined_category.save()

        return JoinCategory(joined_category=joined_category)


class UnJoinCategory(relay.ClientIDMutation):
    """Unsubscribe from a category"""

    class Input:
        category_id = graphene.ID(required=True)

    unjoined_category = graphene.Field(InterestNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        category = Category.objects.get(
            pk=from_global_id(input.get('category_id'))[1])
        user = AndelaUserProfile.objects.get(user=info.context.user)
        unjoined_category = Interest.objects.filter(
            follower_category_id=category.id,
            follower_id=user.id
        ).first()
        if not unjoined_category:
            raise GraphQLError(
                "The User {0}, has not joined {1}. ".format(user, category))

        unjoined_category.delete()
        return UnJoinCategory(unjoined_category=unjoined_category)


class InterestQuery(object):
    interest = relay.Node.Field(InterestNode)
    interests_list = DjangoFilterConnectionField(InterestNode)

    joined_categories = graphene.List(InterestNode)

    def resolve_joined_clubs(self, info):
        user = info.context.user
        return Interest.objects.filter(follower_id=user.id).all()


class InterestMutation(graphene.ObjectType):
    join_category = JoinCategory.Field()
    unjoin_category = UnJoinCategory.Field()
