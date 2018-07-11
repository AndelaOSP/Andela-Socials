import json
import dotenv
from django.http import Http404
from django import http
from django.views.generic.base import TemplateView, View
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.models import User
from django.urls import reverse
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

from django.shortcuts import render
from rest_framework import status
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_jwt.settings import api_settings

from .models import Category, Interest, Event, Attend
from .serializers import CategorySerializer, EventSerializer, AttendanceSerializer,\
  EventDetailSerializer, InterestSerializer
from .setpagination import LimitOffsetpage
from .slack import get_slack_name, notify_channel, notify_user


class LoginRequiredMixin(object):

    '''View mixin which requires that the user is authenticated.'''

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(
            request, *args, **kwargs)


class ExemptCSRFMixn(object):
    """View mixin defined to exempt csrf."""

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(ExemptCSRFMixn, self).dispatch(
    request, *args, **kwargs)


class DashBoardView(APIView):

    permission_classes = (AllowAny,)

    def get(self, request):
      if dotenv.get('NODE_ENV') == 'development':
        return Response('welcome to Andela social API')
      return render(request, 'index.html', {'environment': dotenv.get('NODE_ENV')})


class CategoryListView(ListAPIView):
    """List all Categories."""

    model = Category
    serializer_class = CategorySerializer
    pagination_class = LimitOffsetpage
    filter_fields = ('name',)
    queryset = Category.objects.all()


class JoinSocialClubView(APIView):
    """Join a social club."""

    def post(self, request):

        club_id = request.data.get('club_id')

        # get the category for the club_id
        user_category = Category.objects.get(id=club_id)
        user_interest = Interest(
            follower=request.cached_user,
            follower_category=user_category
        )
        user_interest.save()

        serializer = InterestSerializer(user_interest)
        return Response(serializer.data)


class UnjoinSocialClubView(APIView):
    """Unsubscribe from a social club"""

    def post(self, request):

        club_id = request.data.get('club_id')
        user = request.cached_user

        # get the category for the club_id
        Interest.objects.filter(follower_category_id=club_id, follower_id=user.id).delete()

        return Response({'club_id': club_id})


class JoinedClubsView(ListAPIView):
    """List of social clubs a user has joined."""

    model = Interest
    serializer_class = InterestSerializer

    def get_queryset(self):
        user = self.request.cached_user
        joined_clubs = Interest.objects.filter(follower_id=user.id).all()
        return joined_clubs


class SocialClubDetail(GenericAPIView):
    """List all Social Club Details."""

    model = Category
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        category_id = kwargs.get('pk')
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            raise Http404

        serializer = CategorySerializer(category)
        return Response(serializer.data)


class AttendSocialEventView(APIView):
    """Attend a social event."""

    def post(self, request):

        event_id = request.data.get('event_id')

        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise Http404

        user_attendance = Attend(
            user=request.cached_user,
            event=event
        )
        user_attendance.save()

        serializer = AttendanceSerializer(user_attendance)
        return Response(serializer.data)


class SubscribedEventsView(ListAPIView):
    """List of events a user has joined."""

    model = Attend
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        user = self.request.cached_user
        subscribed_events = Attend.objects.filter(user_id=user.id).all()
        return subscribed_events


class UnsubscribeEventView(APIView):
    """Unsubscribe from an event"""

    def post(self, request):

        event = request.data.get('event')
        user = request.cached_user

        # get the event
        Attend.objects.filter(event_id=event, user_id=user.id).delete()

        return Response({'event_id': event})


class CreateEventView(CreateAPIView):
    """Create a new event"""

    def post(self, request, *args, **kwargs):

        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)

        title = body_data.get('title')
        description = body_data.get('description')
        venue = body_data.get('venue')
        date = body_data.get('date')
        time = body_data.get('time'),
        featured_image = body_data.get('featured_image')
        social_event_id = body_data.get('category_id')

        try:
            social_event = Category.objects.get(id=int(social_event_id))
        except Category.DoesNotExist:
            raise Http404

        new_event = Event(
            title=title,
            description=description,
            venue=venue,
            date=date,
            time=time,
            featured_image=featured_image,
            creator=request.cached_user,
            social_event=social_event
        )
        new_event.save()

        serializer = EventSerializer(new_event)
        return Response(serializer.data)


class EventDetail(GenericAPIView):
    """List all Social Club Details."""

    model = Event
    serializer_class = EventDetailSerializer

    def get(self, request, *args, **kwargs):
        event_id = kwargs.get('pk')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise Http404

        serializer = EventDetailSerializer(event)
        return Response(serializer.data)
