import graphene
from graphene_django.debug import DjangoDebug
from .attend.schema import Query as AttendQuery, Mutation as AttendMutation
from .category.schema import Query as CategoryQuery
from .event.schema import Query as EventQuery, Mutation as EventMutation
from .interest.schema import Query as InterestQuery, Mutation as InterestMutation

class Query(
  CategoryQuery,
  InterestQuery,
  EventQuery,
  AttendQuery,
  graphene.ObjectType
):
  debug = graphene.Field(DjangoDebug, name='__debug')
  pass

class Mutation(
  EventMutation,
  InterestMutation,
  AttendMutation,
  graphene.ObjectType
  ):
  pass


schema = graphene.Schema(query=Query, mutation=Mutation)
