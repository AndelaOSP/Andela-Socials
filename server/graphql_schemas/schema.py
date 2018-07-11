import graphene

from graphene_django.debug import DjangoDebug

from .attend.schema import AttendQuery, AttendMutation
from .category.schema import CategoryQuery
from .event.schema import EventQuery, EventMutation
from .interest.schema import InterestQuery, InterestMutation


class Query(
  CategoryQuery,
  InterestQuery,
  EventQuery,
  AttendQuery,
  graphene.ObjectType
):
  debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(
  EventMutation,
  InterestMutation,
  AttendMutation,
  graphene.ObjectType
  ):
  debug = graphene.Field(DjangoDebug, name='__debug')


schema = graphene.Schema(query=Query, mutation=Mutation)
