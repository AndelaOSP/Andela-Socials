import logging
import mock
from graphql_relay import to_global_id

from .base import BaseEventTestCase
from ..events.base import create_user

logging.disable(logging.ERROR)


class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """
    @mock.patch('graphql_schemas.event.schema.send_calendar_invites')
    def test_user_attend_model_is_populated_with_new_event(self, mock_send_calendar):
        query1 = f"""
        mutation CreateEvent{{
            createEvent(input: {{
                title:"test title",
                description:"test description",
                venue:"test venue",
                startDate:"2018-08-09T18:00:00.000Z",
                endDate:"2018-08-09T18:00:00.000Z",
                timezone: "Africa/Algiers",
                categoryId: "{to_global_id("CategoryNode", self.category.id)}",
                featuredImage: "http://fake-image.com"
            }}) {{
                newEvent{{
                title
                description
                }}
            }}
        }}
        """
        request = self.request
        authorized_calendar_user = create_user(
            'authorizedTestId', calendar_authorized=True)
        request.user = authorized_calendar_user.user
        self.client.execute(query1, context_value=request)

        query2 = '''
        query{
            attendersList{
                edges{
                node{
                    id
                    event {
                        id
                        title
                    }
                    status
                }
                }
            }
        }
        '''

        self.request.user = self.andela_user.user
        result = self.client.execute(query2, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_cannot_fetch_attendance_if_user_is_not_owner_or_attendee(self):
        query = '''
        query{
            attendersList{
                edges{
                node{
                    id
                    event {
                        id
                        title
                        active
                        endDate
                    }
                }
                }
            }
        }
        '''

        self.request.user = self.andela_user2.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_can_fetch_user_event(self):
        query = '''
        query{
            subscribedEvents{
                id
                event{
                    id
                    title
                }
                status
            }
        }
        '''

        self.request.user = self.andela_user.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_can_fetch_single_attendance(self):
        query = f'''
        query{{
            eventAttendance(id:
                "{to_global_id("AttendNode", self.attendance.id)}"){{
                    id
                    event{{
                        id
                        title
                    }}
                    status
                }}
            }}
        '''

        self.request.user = self.andela_user.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
