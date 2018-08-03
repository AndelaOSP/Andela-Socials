from django.test import RequestFactory
from api.models import Category, AndelaUserProfile, UserProxy
from graphene.test import Client
from snapshottest.django import TestCase

from graphql_schemas.schema import schema


class BaseEventTestCase(TestCase):
    def setUp(self):
        for index in range(1,6):
            Category.objects.create(
                id=index,
                name="Swimming Meetup {}".format(index),
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
        self.request = RequestFactory().get('/graphql')
        self.client = Client(schema)

    def tearDown(self):
        Category.objects.all().delete()
