import graphene
from graphene_django.debug import DjangoDebug

class Query(graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='__debug')
    pass

class Mutation(graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)
