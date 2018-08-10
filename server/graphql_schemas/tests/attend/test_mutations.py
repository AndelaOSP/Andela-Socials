import logging
from django.db import transaction

from graphql_relay import to_global_id
from api.models import Attend, User
from .base import BaseEventTestCase

logging.disable(logging.ERROR)


class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """

    def test_user_can_subcribe_to_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_subscribe_to_event_twice(self):
        Attend.objects.create(
            user=self.andela_user1,
            event=self.event
        )
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_subscribe_to_nonexisting_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", 100)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_nonexisting_user_cannot_subscribe_to_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = User(id=100)
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_can_unsubscribe_from_event(self):
        query = f'''
        mutation subscribe {{
            unattendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event2.id)}",
                clientMutationId: "rand"
            }}) {{
                clientMutationId
                unsubscribedEvent {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_unsubscribe_from_event_they_did_not_attend(self):
        query = f'''
        mutation subscribe {{
            unattendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                unsubscribedEvent {{
                    event {{
                        title
                        description
                        venue
                        date
                        time
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)


class RejectInviteTestCase(BaseEventTestCase):
    """
    Test decline mutation queries
    """
    def test_user_can_decline_invite_to_event(self):
        query = '''
        mutation subscribe {
            declineEvent(input: {eventId: "RXZlbnROb2RlOjI=", clientMutationId: "rand"}) {
                clientMutationId
                declinedEvent {
                    id
                    event {
                        id
                        title
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                    user {
                        id
                        googleId
                    }
                }
            }
        }
        '''

        self.request.user = self.user4
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
    
    def test_user_can_decline_invite_to_multiple_events(self):
        query = '''
        mutation subscribe {
            declineEvent(input: {eventId: "RXZlbnROb2RlOjE=", clientMutationId: "rand"}) {
                clientMutationId
                declinedEvent {
                    id
                    event {
                        id
                        title
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                    user {
                        id
                        googleId
                    }
                }
            }
        }
        '''

        self.request.user = self.user4
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_can_not_decline_invite_more_than_once(self):
        query = '''
        mutation subscribe {
            declineEvent(input: {eventId: "RXZlbnROb2RlOjE=", clientMutationId: "rand"}) {
                clientMutationId
                declinedEvent {
                    id
                    event {
                        id
                        title
                        featuredImage
                        socialEvent {
                            name
                            description
                        }
                    }
                    user {
                        id
                        googleId
                    }
                }
            }
        }
        '''
        # https://stackoverflow.com/questions/21458387/transactionmanagementerror-you-cant-execute-queries-until-the-end-of-the-atom
        with transaction.atomic():
            self.request.user = self.user3
            result = self.client.execute(query, context_value=self.request)
            self.assertMatchSnapshot(result)
 