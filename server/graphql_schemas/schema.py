import graphene
from graphene_django.debug import DjangoDebug

from .category.schema import Query as CategoryQuery
from .interest.schema import Query as InterestQuery


class Query(
  CategoryQuery,
  InterestQuery,
  graphene.ObjectType,
):
  debug = graphene.Field(DjangoDebug, name='__debug')
  pass


class Mutation(graphene.ObjectType):
  pass


schema = graphene.Schema(query=Query)
