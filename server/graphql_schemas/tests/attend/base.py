from django.test import RequestFactory
from api.models import AndelaUserProfile, Category, Event, Attend,\
    Interest
from graphene.test import Client
from snapshottest.django import TestCase

from graphql_schemas.schema import schema
from django.utils import timezone

from ..events.base import create_user


def create_interest(user, category):
    interest = Interest.objects.create(
        follower=user,
        follower_category=category
    )
    return interest


class BaseEventTestCase(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Swimming Meetup",
            description="For people who want to be happy.",
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.andela_user = create_user('andela_user', calendar_authorized=True)
        self.andela_user2 = create_user(
            'andela_user2', calendar_authorized=True)
        self.andela_user3 = create_user(
            'andela_user3', calendar_authorized=True)
        create_interest(self.andela_user, self.category)
        create_interest(self.andela_user2, self.category)
        create_interest(self.andela_user3, self.category)
        self.event = Event.objects.create(
            title="Test",
            description="THis is a test event",
            venue="Epic Tower",
            creator=self.andela_user,
            start_date=timezone.now(),
            end_date=timezone.now(),
            social_event=self.category,
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.event2 = Event.objects.create(
            title="Test Event 2",
            description="This is a test event",
            venue="Epic Tower",
            creator=self.andela_user,
            start_date=timezone.now(),
            end_date=timezone.now(),
            social_event=self.category,
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.attendance = Attend.objects.create(
            user=self.andela_user,
            event=self.event2
        )
        self.request = RequestFactory().get('/graphql')
        self.client = Client(schema)

    def tearDown(self):
        Category.objects.all().delete()
        AndelaUserProfile.objects.all().delete()
        Event.objects.all().delete()
