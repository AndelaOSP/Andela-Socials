from django.contrib.auth.models import User

from rest_framework import serializers

from .models import AndelaUserProfile, Category, Event, Interest, Attend

''' Script Used to convert python objects to json objects.'''


class UserSerializer(serializers.ModelSerializer):
    """User Model serializer class."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class AndelaUserProfileSerializer(serializers.ModelSerializer):
    """GoogleUser Model serializer class."""

    class Meta:
        model = AndelaUserProfile
        fields = ('google_id', 'user', 'user_picture', 'slack_name')
        depth = 1


class EventSerializer(serializers.ModelSerializer):

    creator = AndelaUserProfileSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'venue', 'date', 'time', 'social_event', 'creator', 'featured_image',
                  'created_at', 'attendees_count')


class AttendanceSerializer(serializers.ModelSerializer):
    """Attend Model serializer class."""

    user = AndelaUserProfileSerializer(read_only=True)

    class Meta:
        model = Attend
        fields = ('user', 'event')


class EventDetailSerializer(serializers.ModelSerializer):

    attendees = AttendanceSerializer(many=True, read_only=True)
    creator = AndelaUserProfileSerializer(read_only=True)

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
