from django.test import TestCase
from django.utils import timezone
from datetime import datetime, timedelta

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
            start_date=timezone.now(),
            end_date=timezone.now(),
            creator=self.andela_user1,
            social_event=self.category1,
            active=True
        )

        self.event_2 = Event.objects.create(
            title='event2',
            description='event2 description',
            venue='event2 venue',
            start_date = str(datetime.now()),
            end_date = (datetime.now()),
            creator=self.andela_user1,
            social_event=self.category1,
            active=True,
            timezone = 'utc'
        )

        self.event_3 = Event.objects.create(
            title='event3',
            description='event3 description',
            venue='event3 venue',
            start_date = str(timezone.now() + timedelta(hours=24)),
            end_date = (timezone.now() + timedelta(hours=25)),
            creator=self.andela_user1,
            social_event=self.category1,
            active=True,
            timezone = 'utc'
        )
        
