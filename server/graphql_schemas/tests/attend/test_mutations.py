import logging

from django.contrib.auth.models import User
from api.models import Attend
from .base import BaseEventTestCase

logging.disable(logging.ERROR)


class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """
    def test_user_can_subcribe_to_event(self):
        query = '''
        mutation subscribe {
            attendEvent(input: {eventId: 1, clientMutationId: "rand"}) {
                clientMutationId
                newAttendance {
                    event {
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_subscribe_to_event_twice(self):
        Attend.objects.create(
            user=self.andela_user,
            event=self.event
        )
        query = '''
        mutation subscribe {
            attendEvent(input: {eventId: 1, clientMutationId: "rand"}) {
                clientMutationId
                newAttendance {
                    event {
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_subscribe_to_nonexisting_event(self):
        query = '''
        mutation subscribe {
            attendEvent(input: {eventId: 100, clientMutationId: "rand"}) {
                clientMutationId
                newAttendance {
                    event {
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_nonexisting_user_cannot_subscribe_to_event(self):
        query = '''
        mutation subscribe {
            attendEvent(input: {eventId: 1, clientMutationId: "rand"}) {
                clientMutationId
                newAttendance {
                    event {
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                }
            }
        }
        '''

        self.request.user = User(id=100)
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
