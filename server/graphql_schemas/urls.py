from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf.urls import url
from graphene_django.views import GraphQLView

class AuthenticatedGraphView(GraphQLView, LoginRequiredMixin):
  pass

urlpatterns = [
  url(r'^', AuthenticatedGraphView.as_view(graphiql=True)),
]
