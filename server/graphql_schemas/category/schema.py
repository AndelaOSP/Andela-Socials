import graphene
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from django.db import IntegrityError

from api.models import Category


class CategoryNode(DjangoObjectType):
    """
        Handles the category nodes
    """

    class Meta:
        model = Category
        filter_fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'description': ['icontains', 'istartswith'],
        }
        interfaces = (relay.Node,)


class CategoryQuery(object):
    category = relay.Node.Field(CategoryNode)
    category_list = DjangoFilterConnectionField(CategoryNode)


class CreateCategory(relay.ClientIDMutation):
    class Input:
        """
        define fields that would be pass in
        """
        name = graphene.String()
        featured_image = graphene.String(required=True)
        description = graphene.String(required=True)

    new_category = graphene.Field(CategoryNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        """
        handles create category
        Params:
            root(dict): root query field data
            info(dict): authentication and user information
            input(dict): the request input sent by the user
        Returns:
            create the category
        """
        try:
            new_category, new_created = Category.objects.get_or_create(**input)
            if not new_created:
                raise GraphQLError('You cannot create the same category twice')
        except IntegrityError:
            name = input.get('name')
            raise GraphQLError(f'category {name} already exists')
        return cls(new_category=new_category)


class CategoryMutation(graphene.ObjectType):
    """
        Handles category mutation
    """
    create_category = CreateCategory.Field()
