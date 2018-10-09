import rest_framework

from graphene_django.views import GraphQLView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.settings import api_settings
from graphene_file_upload.django import FileUploadGraphQLView

from graphql_schemas.utils.helpers import UnauthorizedCalendarError

from graphql.error.located_error import GraphQLLocatedError


class DRFAuthenticatedGraphQLView(FileUploadGraphQLView, GraphQLView):

    def parse_body(self, request):
        content_type = self.get_content_type(request)
        if content_type != 'multipart/form-data':
            return request.data
        return super(DRFAuthenticatedGraphQLView, self).parse_body(request)

    @classmethod
    def as_view(cls, *args, **kwargs):
        view = super(GraphQLView, cls).as_view(*args, **kwargs)
        view = permission_classes(
            api_settings.DEFAULT_PERMISSION_CLASSES)(view)
        view = authentication_classes(
            api_settings.DEFAULT_AUTHENTICATION_CLASSES)(view)
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
            if isinstance(error, GraphQLLocatedError):
                return format_located_error(error)
            return GraphQLView.format_error(error)
        except Exception as error:
            return GraphQLView.format_error(error)


def format_located_error(error):
    if isinstance(error.original_error, GraphQLLocatedError):
        return format_located_error(error.original_error)
    if isinstance(error.original_error, UnauthorizedCalendarError):
        return {'message': error.original_error.message,
                'AuthUrl': error.original_error.auth_url}
    return GraphQLView.format_error(error)
