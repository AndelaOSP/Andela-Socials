from django.contrib.auth.models import User

from rest_framework import serializers

from .models import GoogleUser, Category, Event, Interest, Attend

''' Script Used to convert python objects to json objects.'''


class UserSerializer(serializers.ModelSerializer):
    """User Model serializer class."""

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class GoogleUserSerializer(serializers.ModelSerializer):
    """GoogleUser Model serializer class."""

    class Meta:
        model = GoogleUser
        fields = ('google_id', 'app_user', 'appuser_picture', 'slack_name')
        depth = 1


class CustomUserSerializer(serializers.ModelSerializer):
    """Custom User Model serializer class."""

    class Meta:
        model = GoogleUser
        fields = ('slack_name', 'app_user')
        depth = 1


class EventSerializer(serializers.ModelSerializer):

    creator = CustomUserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'venue', 'date', 'time', 'social_event', 'creator', 'featured_image',
                  'created_at', 'attendees_count')


class AttendanceSerializer(serializers.ModelSerializer):
    """Attend Model serializer class."""

    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Attend
        fields = ('user', 'event')


class EventDetailSerializer(serializers.ModelSerializer):

    attendees = AttendanceSerializer(many=True, read_only=True)
    creator = CustomUserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'venue', 'date', 'time', 'social_event', 'creator', 'featured_image',
                  'created_at', 'attendees')


class CategorySerializer(serializers.ModelSerializer):
    """Category Model serializer class."""

    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'members_count', 'featured_image', 'description', 'events')


class InterestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interest
        fields = ('follower', 'follower_category')
