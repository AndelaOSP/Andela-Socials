from django.test import TestCase

from api.models import (AndelaUserProfile, Event, Category, UserProxy)


class BaseSetup(TestCase):

    def setUp(self):
        self.category1 = Category.objects.create(
            id=1,
            name="Gaming Meetup",
            description="For people who want to be happy.",
            featured_image="https://cdn.elegantthemes.com/"
        )
        self.user1 = UserProxy.create_user({
            "username": "testuser1",
            "first_name": "test",
            "last_name": "user",
            "email": "test@andela.com"
        })
        self.andela_user1 = AndelaUserProfile.objects.create(
            google_id=1,
            user=self.user1,
            user_picture="https://lh5.googleusercontent.com"
        )
        self.event_1 = Event.objects.create(
            title='event1',
            description='event1 description',
            venue='event1 venue',
            date='September 10, 2017',
            time='01:00pm WAT',
            creator=self.andela_user1,
            social_event=self.category1,
            active=True
        )
