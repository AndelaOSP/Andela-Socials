from django.test import RequestFactory
from api.models import AndelaUserProfile, UserProxy
from graphene.test import Client
from snapshottest.django import TestCase

from graphql_schemas.schema import schema


class BaseEventTestCase(TestCase):
    def setUp(self):
        self.user1 = UserProxy.create_user({
            "username": "testuser",
            "first_name": "test",
            "last_name": "user",
            "email": "test@andela.com"
        })
        self.user2 = UserProxy.create_user({
            "username": "anotherUser",
            "first_name": "another",
            "last_name": "user",
            "email": "user2@andela.com"
        })
        self.user3 = UserProxy.create_user({
            "username": "thirdUser",
            "first_name": "third",
            "last_name": "user",
            "email": "user3@andela.com"
        })
        self.user4 = UserProxy.create_user({
            "username": "fourthUser",
            "first_name": "fourth",
            "last_name": "user",
            "email": "user4@andela.com"
        })
        self.andela_user1 = AndelaUserProfile.objects.create(
            google_id=123233,
            user=self.user1,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.andela_user2 = AndelaUserProfile.objects.create(
            google_id=344445,
            user=self.user2,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.andela_user3 = AndelaUserProfile.objects.create(
            google_id=84754,
            user=self.user3,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.andela_user4 = AndelaUserProfile.objects.create(
            google_id=45444,
            user=self.user4,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.request = RequestFactory().get('/graphql')
        self.client = Client(schema)

    def tearDown(self):
        AndelaUserProfile.objects.all().delete()
        UserProxy.objects.all().delete()
