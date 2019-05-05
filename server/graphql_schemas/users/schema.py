import graphene
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from api.models import AndelaUserProfile
from api.slack import get_slack_user_token


class AndelaUserNode(DjangoObjectType):
    class Meta:
        model = AndelaUserProfile
        filter_fields = {}
        interfaces = (relay.Node, )
        exclude_fields = ('credential', )


class AndelaUserQuery(object):
    user = relay.Node.Field(AndelaUserNode)
    users_list = DjangoFilterConnectionField(AndelaUserNode)


class CreateUserAuth(relay.ClientIDMutation):
    user = graphene.Field(AndelaUserNode)

    class Input:
        code = graphene.String()

    def mutate_and_get_payload(root, info, **input):
        user = info.context.user
        code = input.get('code')

        profile = AndelaUserProfile.objects.get(user_id=user.id)
        slack_reponse = get_slack_user_token(code)

        if 'error' in slack_reponse:
            raise Exception(slack_reponse['error'])

        profile.slack_token = slack_reponse['access_token']
        profile.save()

        return CreateUserAuth(user=profile)


class AndelaUserMutation(graphene.AbstractType):
    create_user_auth = CreateUserAuth.Field()
