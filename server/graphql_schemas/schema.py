import graphene

from graphene_django.debug import DjangoDebug

from .attend.schema import AttendQuery, AttendMutation
from .category.schema import CategoryQuery, CategoryMutation
from .event.schema import EventQuery, EventMutation
from .interest.schema import InterestQuery, InterestMutation
from .users.schema import AndelaUserQuery
from .image.schema import ImageMutation


class Query(
  CategoryQuery,
  InterestQuery,
  EventQuery,
  AttendQuery,
  AndelaUserQuery,
  graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(
  EventMutation,
  InterestMutation,
  AttendMutation,
  CategoryMutation,
  ImageMutation,
  graphene.ObjectType
  ):
    debug = graphene.Field(DjangoDebug, name='__debug')


schema = graphene.Schema(query=Query, mutation=Mutation)
