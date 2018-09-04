from django.test import RequestFactory
from api.models import Category, AndelaUserProfile, UserProxy, Interest
from graphene.test import Client
from snapshottest.django import TestCase

from graphql_schemas.schema import schema


class BaseEventTestCase(TestCase):
    def setUp(self):
        self.category1 = Category.objects.create(
            id=1,
            name="Gaming Meetup",
            description="For people who want to be happy.",
            featured_image="https://cdn.elegantthemes.com/10"
        )
        self.category2 = Category.objects.create(
            id=2,
            name="Python Meetup",
            description="For people who want to be happy.",
            featured_image="https://cdn.elegantthemes.com/11"
        )
        self.user = UserProxy.create_user({
            "username": "testuser",
            "first_name": "test",
            "last_name": "user",
            "email": "test@andela.com"
        })
        self.user2 = UserProxy.create_user({
            "username": "testuser2",
            "first_name": "test",
            "last_name": "user",
            "email": "test@andela.com"
        })
        self.andela_user1 = AndelaUserProfile.objects.create(
            google_id=1,
            user=self.user,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.andela_user2 = AndelaUserProfile.objects.create(
            google_id=2,
            user=self.user2,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.Interest1 = Interest.objects.create(
            follower=self.andela_user1,
            follower_category=self.category1
        )
        self.Interest2 = Interest.objects.create(
            follower=self.andela_user1,
            follower_category=self.category2
        )
        self.Interest3 = Interest.objects.create(
            follower=self.andela_user2,
            follower_category=self.category1
        )

        self.request = RequestFactory().get('/graphql')
        self.client = Client(schema)

    def tearDown(self):
        Category.objects.all().delete()
        Interest.objects.all().delete()
        AndelaUserProfile.objects.all().delete()
