from django.test import RequestFactory
from api.models import AndelaUserProfile, Category, Event, UserProxy, Attend
from graphene.test import Client
from snapshottest.django import TestCase

from graphql_schemas.schema import schema
from django.utils import timezone


class BaseEventTestCase(TestCase):
    def setUp(self):
        category = Category.objects.create(
            id=1,
            name="Swimming Meetup",
            description="For people who want to be happy.",
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.user = UserProxy.create_user({
            "username": "testuser",
            "first_name": "test",
            "last_name": "user",
            "email": "test@andela.com"
        })
        self.andela_user = AndelaUserProfile.objects.create(
            google_id=1,
            user=self.user,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.event = Event.objects.create(
            id=1,
            title="Test",
            description="THis is a test event",
            venue="Epic Tower",
            creator=self.andela_user,
            social_event=category,
            start_date=timezone.now(),
            end_date=timezone.now(),
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.event2 = Event.objects.create(
            id=2,
            title="Test Event 2",
            description="This is a test event",
            venue="Epic Tower",
            creator=self.andela_user,
            start_date=timezone.now(),
            end_date=timezone.now(),
            social_event=category,
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
