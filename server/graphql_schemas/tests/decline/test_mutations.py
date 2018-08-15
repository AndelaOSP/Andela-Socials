import logging
from django.db import transaction

from graphql_relay import to_global_id
from api.models import Attend, User
from .base import BaseEventTestCase

logging.disable(logging.ERROR)


class RejectInviteTestCase(BaseEventTestCase):
    """
    Test decline mutation queries
    """
    def test_user_can_decline_invite_to_event(self):
        query = f'''
        mutation subscribe {{
            declineEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                declinedEvent {{
                    id
                    event {{
                        id
                        title
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                    user {{
                        id
                        googleId
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user3
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
    
    def test_user_can_decline_invite_to_multiple_events(self):
        query = f'''
        mutation subscribe {{
            declineEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event2.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                declinedEvent {{
                    id
                    event {{
                        id
                        title
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                    user {{
                        id
                        googleId
                    }}
                }}
            }}
        }}
        '''

        self.request.user = self.user3
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_can_not_decline_invite_more_than_once(self):
        query = f'''
        mutation subscribe {{
            declineEvent(input: {{
                eventId: "{to_global_id("EventNode", self.event.id)}",
                clientMutationId: "rand"
            }})
            {{
                clientMutationId
                declinedEvent {{
                    id
                    event {{
                        id
                        title
                        featuredImage
                        socialEvent {{
                            name
                            description
                        }}
                    }}
                    user {{
                        id
                        googleId
                    }}
                }}
            }}
        }}
        '''
        # https://stackoverflow.com/questions/21458387/transactionmanagementerror-you-cant-execute-queries-until-the-end-of-the-atom
        with transaction.atomic():
            self.request.user = self.user1
            result = self.client.execute(query, context_value=self.request)
            self.assertMatchSnapshot(result)
