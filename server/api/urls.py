from django.conf.urls import url

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

from api import views

urlpatterns = [
    url(r'^auth/token/?$', obtain_jwt_token,
        name="obtain-token"),

    url(r'^auth/token-verify/?$', verify_jwt_token,
        name="verify-token"),

    url(r'^categories/?$', views.CategoryListView.as_view(),
        name='apicategory'),

    url(r'^home/?$',
        views.DashBoardView.as_view(),
        name='dashboard'),

    url(r'^join/?$', views.JoinSocialClubView.as_view(),
        name='join'),

    url(r'^unjoin/?$', views.UnjoinSocialClubView.as_view(),
        name='unjoin'),

    url(r'^joined/?$', views.JoinedClubsView.as_view(),
        name='joined'),

    url(r'^categories/?$', views.CategoryListView.as_view(),
        name='apicategory'),

    url(r'^category/(?P<pk>[0-9]+)/events/?$', views.SocialClubDetail.as_view(),
        name="user-detail"),

    url(r'^attend/?$', views.AttendSocialEventView.as_view(),
        name='attend'),

    url(r'^unsubscribe/?$', views.UnsubscribeEventView.as_view(),
        name='unsubscribe'),

    url(r'^subscribed/?$', views.SubscribedEventsView.as_view(),
        name='subscribed'),

    url(r'^create/event/?$', views.CreateEventView.as_view(),
        name='create_event'),

    url(r'^event/(?P<pk>[0-9]+)/?$', views.EventDetail.as_view(),
        name='event_detail'),

    url(r'^oauthcallback/?$', views.OauthCallback.as_view(),
        name='oauth_callback'),
]
