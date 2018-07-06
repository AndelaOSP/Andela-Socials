import graphene
from graphene_django.debug import DjangoDebug

from .attend.schema import Query as AttendQuery
from .category.schema import Query as CategoryQuery
from .event.schema import Query as EventQuery
from .interest.schema import Query as InterestQuery, Mutation as InterestMutation


class Query(
  CategoryQuery,
  InterestQuery,
  EventQuery,
  AttendQuery,
  graphene.ObjectType,
):
  debug = graphene.Field(DjangoDebug, name='__debug')
  pass


class Mutation(InterestMutation,
               graphene.ObjectType):
  pass


schema = graphene.Schema(query=Query, mutation=Mutation)
