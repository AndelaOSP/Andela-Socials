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
