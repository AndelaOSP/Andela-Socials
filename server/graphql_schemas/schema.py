import graphene

from graphene_django.debug import DjangoDebug

from .attend.schema import AttendQuery, AttendMutation, DeclineMutation, DeclineQuery
from .category.schema import CategoryQuery, CategoryMutation
from .event.schema import EventQuery, EventMutation
from .interest.schema import InterestQuery, InterestMutation
from .users.schema import AndelaUserQuery


class Query(
  CategoryQuery,
  InterestQuery,
  EventQuery,
  AttendQuery,
  DeclineQuery,
  AndelaUserQuery,
  graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(
  EventMutation,
  InterestMutation,
  AttendMutation,
  DeclineMutation,
  CategoryMutation,
  graphene.ObjectType
  ):
    debug = graphene.Field(DjangoDebug, name='__debug')


schema = graphene.Schema(query=Query, mutation=Mutation)
