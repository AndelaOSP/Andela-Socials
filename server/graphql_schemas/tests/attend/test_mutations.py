import logging
from graphql_relay import to_global_id
from api.models import User
from .base import BaseEventTestCase
from unittest.mock import patch


logging.disable(logging.ERROR)

class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """
    @patch('api.utils.backgroundTaskWorker.BackgroundTaskWorker.start_work')
    def test_user_can_attend_an_event(self, mock_background_task):
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
        mock_background_task.assert_called_once()
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

    @patch('api.utils.backgroundTaskWorker.BackgroundTaskWorker.start_work')
    def test_user_can_change_event_status(self, mock_background_task):
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
        mock_background_task.assert_called_once()
