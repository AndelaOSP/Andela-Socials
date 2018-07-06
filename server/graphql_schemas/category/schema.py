from api.models import Category
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType


class CategoryNode(DjangoObjectType):
  class Meta:
    model = Category
    filter_fields = {
      'name': ['exact', 'icontains', 'istartswith'],
      'description': ['icontains', 'istartswith'],
    }
    interfaces = (relay.Node,)


class Query(object):
  ####
  category = relay.Node.Field(CategoryNode)
  category_list = DjangoFilterConnectionField(CategoryNode)
