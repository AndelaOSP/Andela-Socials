import logging

from graphql_relay import to_global_id
from api.models import Attend, User
from .base import BaseEventTestCase

logging.disable(logging.ERROR)


class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """

    def test_user_can_attend_an_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                status: "attending",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        id
                        title
                    }}
                    status
                }}
            }}
        }}
        '''
        self.request.user = self.andela_user.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_subscribe_to_nonexisting_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", 100)}",
                status: "attending",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        id
                        title
                    }}
                    status
                }}
            }}
        }}
        '''

        self.request.user = self.andela_user.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_nonexisting_user_cannot_subscribe_to_event(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                status: "attending",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        id
                        title
                    }}
                    status
                }}
            }}
        }}
        '''

        self.request.user = User(id=100)
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_can_change_event_status(self):
        query = f'''
        mutation subscribe {{
            attendEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                status: "declined",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                newAttendance {{
                    event {{
                        id
                        title
                    }}
                    status
                }}
            }}
        }}
        '''

        self.request.user = self.andela_user.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
