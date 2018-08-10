import logging
from .base import BaseEventTestCase

logging.disable(logging.ERROR)


class AttendanceTestCase(BaseEventTestCase):
    """
    Test attend mutation queries
    """

    def test_can_fetch_all_attendance(self):
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
                        date
                    }
                }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_can_fetch_user_subscribed_event(self):
        query = '''
        query{
            subscribedEvents{
                id
                event{
                    id
                    time
                    date
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
    
    def test_can_fetch_single_event(self):
        query = '''
        query{
            eventAttendance(id:"QXR0ZW5kTm9kZToxMA=="){
                id
                event{
                    id
                    time
                    date
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
