from django.conf.urls import url

from .views import DRFAuthenticatedGraphQLView

urlpatterns = [
    url(r'^graphql', DRFAuthenticatedGraphQLView.as_view(
        graphiql=True, pretty=True), name="index"),
]
