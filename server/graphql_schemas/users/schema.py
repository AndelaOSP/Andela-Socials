import graphene

from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from api.models import AndelaUserProfile


class AndelaUserNode(DjangoObjectType):
    class Meta:
        model = AndelaUserProfile
        filter_fields = {}
        interfaces = (relay.Node,)
        exclude_fields = ('credential', )


class AndelaUserQuery(object):
    user = relay.Node.Field(AndelaUserNode)
    users_list = DjangoFilterConnectionField(AndelaUserNode)
