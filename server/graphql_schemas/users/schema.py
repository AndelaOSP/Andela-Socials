import graphene
from graphene import relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from api.models import AndelaUserProfile
from api.slack import get_slack_user_token
from api.utils.oauth_helper import get_auth_url


class AndelaUserNode(DjangoObjectType):
    class Meta:
        model = AndelaUserProfile
        filter_fields = {}
        interfaces = (relay.Node, )
        exclude_fields = ('credential', 'slack_token')


class CalendarAuth(graphene.ObjectType):
    auth_url = graphene.String()

class AndelaUserQuery(object):
    """
    Handles the user calendar authentication
    """
    user = relay.Node.Field(AndelaUserNode)
    users_list = DjangoFilterConnectionField(AndelaUserNode)
    calendar_auth = graphene.Field(CalendarAuth)

    def resolve_calendar_auth(self, info, **kwargs):
        """
        get calendar authentication of the user
        Args:
            info(dict): authentication and user information
            kwargs(dict): the kwargs needed
        Returns:
            the authenticated calendar
        """
        user = info.context.user
        andela_user = AndelaUserProfile.objects.get(user_id=user.id)
        auth_url = get_auth_url(andela_user)
        return CalendarAuth(auth_url=auth_url)



class CreateUserAuth(relay.ClientIDMutation):
    user = graphene.Field(AndelaUserNode)

    class Input:
        code = graphene.String()

    def mutate_and_get_payload(root, info, **input):
        """
        creates user authentication
        Args:
            info(dict): authentication and user information
            kwargs(dict): the kwargs needed
        Returns:
            user auth
        """
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
    """
        Handles user mutation
    """
    create_user_auth = CreateUserAuth.Field()
