import rest_framework

from graphene_django.views import GraphQLView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.settings import api_settings
from graphql_schemas.utils.helpers import UnauthorizedCalendarError


class DRFAuthenticatedGraphQLView(GraphQLView):
    def parse_body(self, request):
        if isinstance(request, rest_framework.request.Request):
            return request.data
        return super(GraphQLView, self).parse_body(request)

    @classmethod
    def as_view(cls, *args, **kwargs):
        view = super(GraphQLView, cls).as_view(*args, **kwargs)
        view = permission_classes(api_settings.DEFAULT_PERMISSION_CLASSES)(view)
        view = authentication_classes(api_settings.DEFAULT_AUTHENTICATION_CLASSES)(view)
        view = api_view(['GET', 'POST'])(view)
        return view

    @staticmethod
    def format_error(error):
        """
            Static method that modifies the error object returned for
            Unauthorized Calendars.
                :params error:
        """
        try:
            if isinstance(error.original_error, UnauthorizedCalendarError):
                return {'message': error.original_error.message,
                        'AuthUrl': error.original_error.auth_url}
        except Exception as error:
            return super(DRFAuthenticatedGraphQLView,
                         DRFAuthenticatedGraphQLView).format_error(error)
        else:
            return super(DRFAuthenticatedGraphQLView,
                         DRFAuthenticatedGraphQLView).format_error(error)
