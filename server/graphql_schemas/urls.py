import rest_framework
from django.conf.urls import url
from graphene_django.views import GraphQLView
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings

class DRFAuthenticatedGraphQLView(GraphQLView):
  def parse_body(self, request):
    if isinstance(request, rest_framework.request.Request):
      return request.data
    return super(GraphQLView, self).parse_body(request)

  @classmethod
  def as_view(cls, *args, **kwargs):
    view = super(GraphQLView, cls).as_view(*args, **kwargs)
    view = permission_classes((IsAuthenticated,))(view)
    view = authentication_classes(api_settings.DEFAULT_AUTHENTICATION_CLASSES)(view)
    view = api_view(['GET', 'POST'])(view)
    return view

## To use the Authenticated View switch to Using DRFAuthenticatedGraphQLView in url
urlpatterns = [
  url(r'^graphql', DRFAuthenticatedGraphQLView.as_view(graphiql=True, pretty=True)),
]
