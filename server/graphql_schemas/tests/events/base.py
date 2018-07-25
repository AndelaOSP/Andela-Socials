import datetime
from django.utils import timezone
import pytz

from django.test import RequestFactory
from django.contrib.auth.models import User
from snapshottest.django import TestCase

from graphene.test import Client

from graphql_schemas.schema import schema
from api.models import Event, AndelaUserProfile, Category
from graphql_schemas.views import DRFAuthenticatedGraphQLView as DRF

timezone.now()
date = datetime.datetime(2018, 11, 20, 20, 8, 7, 127325, tzinfo=pytz.UTC)
request_factory = RequestFactory()


def create_user(userId, calendar_authorized=False):
    user = User.objects.create_user(
            username='test_user{}'.format(userId),
            password='fakepassword',
            email='testemail{}@email.com'.format(userId)
            )

    google_object = {
            'user': user,
            'google_id': userId
            }

    if calendar_authorized:
        google_object['token'] = 'some weird unique string'

    andela_user = AndelaUserProfile(**google_object)
    andela_user.save()
    return andela_user


def create_admin_user(userId):
    user = User.objects.create_superuser(
            username='test_user{}'.format(userId),
            password='fakepassword',
            email='testemail{}@email.com'.format(userId)
            )

    andela_user = AndelaUserProfile(
            google_id=userId,
            user=user
            )
    andela_user.save()
    return andela_user


def create_event(event_creator, category, active=True, id=5):
    event = Event(
                id=id,
                title="test title default",
                description="test description default",
                venue="test venue",
                time="3PM",
                date=date,
                creator=event_creator,
                social_event=category,
                active=active,
                created_at=date
            )
    event.save()
    return event


def create_category():
    category = Category(
                    id=1,
                    name="social event",
                    featured_image="featured_image",
                    description="a test description"
            )
    category.save()
    return category


class BaseEventTestCase(TestCase):
    def setUp(self):
        self.event_creator = create_user("creatorId")
        self.non_event_creator = create_user("ncreatorId")
        self.admin = create_admin_user("adminId")
        self.category = create_category()
        self.request = request_factory.get('/graphql')
        self.client = Client(schema, format_error=DRF.format_error)
        create_event(self.event_creator, self.category)
        create_event(self.admin, self.category, active=False, id=2)

    def tearDown(self):
        Event.objects.all().delete()
        AndelaUserProfile.objects.all().delete()
