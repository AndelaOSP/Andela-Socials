import logging
from .base import BaseEventTestCase
from graphql_relay import to_global_id

logging.disable(logging.ERROR)


class QueryDeclinedEventsTestCase(BaseEventTestCase):
    """
    Test queries on events endpoint

    """

    def test_query_declined_users_list(self):
        query = f'''
        query {{
            declinedUsersList(eventId:"{to_global_id("EventNode",
            self.event.id)}"){{
                id,
                event {{
                  id
                }},
                user {{
                  id
                }}
            }}
        }}
        '''
        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_query_declined_events_list(self):
        query = """
        query {
            declinedEventsList{
                id,
                event {
                  id
                }
                user {
                  id
                }
            }
        }
        """
        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
