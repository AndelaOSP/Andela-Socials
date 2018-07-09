import graphene
from graphene_django.debug import DjangoDebug
from .event.schema import Mutation as EventMutation
from .attend.schema import Query as AttendQuery

class Query(
  AttendQuery,
  graphene.ObjectType,
):
  debug = graphene.Field(DjangoDebug, name='__debug')
  pass

class Mutation(
  EventMutation,
  graphene.ObjectType
):
  pass

schema = graphene.Schema(query=Query, mutation=Mutation,)
