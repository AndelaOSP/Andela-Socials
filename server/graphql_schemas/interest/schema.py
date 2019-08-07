import graphene
from copy import deepcopy

from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_relay import from_global_id
from django.db import IntegrityError

from api.models import Interest, Category, AndelaUserProfile


class InterestNode(DjangoObjectType):
    class Meta:
        model = Interest
        filter_fields = {}
        interfaces = (relay.Node,)


class JoinCategory(relay.ClientIDMutation):
    """Join a category"""
    class Input:
        categories = graphene.List(graphene.ID)

    joined_category_list = graphene.List(InterestNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        create bulk category and add category for user
        Args:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            return bulk category created
        """
        category_id_list = [category for category in input.pop('categories')]
        user = AndelaUserProfile.objects.get(user=info.context.user)
        user_category_list = [Category.objects.get(pk=from_global_id(category_id)[1])
            for category_id in category_id_list]
        try:
            joined_category_list = []
            for user_category in user_category_list:
                joined_category  = Interest(follower=user, follower_category=user_category)
                joined_category_list.append(joined_category)
            Interest.objects.bulk_create(joined_category_list)
        except IntegrityError:
            raise GraphQLError(
                'You have previously added an interest. Please try again'
            )

        return JoinCategory(joined_category_list=joined_category_list)


class UnJoinCategory(relay.ClientIDMutation):
    """Unsubscribe from a category"""

    class Input:
        categories = graphene.List(graphene.ID)

    unjoined_categories = graphene.List(InterestNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        remove user category/intrest
        Args:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns: UnJoinCategory method
        """
        categories = input.get('categories')
        user = AndelaUserProfile.objects.get(user=info.context.user)
        categories = list(map(lambda category_id: from_global_id(category_id)[1], categories))
        unjoined_categories_qs = Interest.objects.filter(
            follower_category_id__in=categories,
            follower_id=user.id
        )
        unjoined_categories = deepcopy(unjoined_categories_qs)
        if not unjoined_categories:
            raise GraphQLError(
                "Oops. We were not able to find some of the interests you are trying to remove")

        unjoined_categories_qs.delete()
        return UnJoinCategory(unjoined_categories=unjoined_categories)


class InterestQuery(object):
    """
    Handle interest queries
    """
    interest = relay.Node.Field(InterestNode)
    interests_list = DjangoFilterConnectionField(InterestNode)

    joined_categories = graphene.List(InterestNode)

    def resolve_joined_categories(self, info):
        """
        resolve user interest/categories
        Args:
            info(dict): authentication and user information
            root(dict): root query field data
            input(dict): the request input sent by the user
        Returns: return user interests
        """
        andela_user_profile = AndelaUserProfile.objects.get(user_id=user.id)
        user = info.context.user
        return Interest.objects.filter(
            follower_id=andela_user_profile.id).all()


class InterestMutation(graphene.ObjectType):
    """ Handles user mutation"""
    join_category = JoinCategory.Field()
    unjoin_category = UnJoinCategory.Field()
