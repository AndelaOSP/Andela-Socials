import graphene
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from api.models import Category


class CategoryNode(DjangoObjectType):
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
        name = graphene.String()
        featured_image = graphene.String(required=True)
        description = graphene.String(required=True)

    new_category = graphene.Field(CategoryNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        new_category = Category.objects.create(**input)
        return cls(new_category=new_category)


class CategoryMutation(graphene.ObjectType):
    create_category = CreateCategory.Field()
