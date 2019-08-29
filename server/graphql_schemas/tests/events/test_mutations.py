import mock
from contextlib import suppress
from graphql import GraphQLError
from django.core import mail
from unittest.mock import patch, Mock
from graphql_relay import to_global_id
from graphql_schemas.utils.helpers import UnauthorizedCalendarError
from graphql_schemas.utils.hasher import Hasher
from .base import BaseEventTestCase, create_user, past_date


class MutateEventTestCase(BaseEventTestCase):
    """
    Tests the events api queries and mutations
    """

    @patch('api.utils.backgroundTaskWorker.BackgroundTaskWorker.start_work')
    def test_deactivate_event_as_creator(self, mock_background_task):
        query = f"""
            mutation {{
                deactivateEvent(input: {{
                    eventId: "{to_global_id("EventNode", self.user_event.id)}"
                }})
                {{
                    actionMessage
                }}
            }} """
        request = self.request
        client = self.client
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query,
                                                context_value=request))
        self.assertEqual(mock_background_task.call_count, 2)

    def test_deactivate_event_as_non_creator(self):
        with suppress(GraphQLError):
            query = f"""
            mutation {{
                deactivateEvent(input: {{
                    eventId: "{to_global_id("EventNode", self.user_event.id)}"
                }})
                {{
                    actionMessage
                }}
            }} """
            request = self.request
            client = self.client
            request.user = self.non_event_creator.user
            self.assertMatchSnapshot(client.execute(query,
                                                    context_value=request))

    @patch('api.utils.backgroundTaskWorker.BackgroundTaskWorker.start_work')
    def test_deactivate_event_as_admin(self, mock_background_task):
        query = f"""
        mutation {{
            deactivateEvent(input: {{
                eventId: "{to_global_id("EventNode", self.user_event.id)}"
            }})
            {{
                actionMessage
            }}
        }} """
        request = self.request
        client = self.client
        request.user = self.admin.user
        self.assertMatchSnapshot(client.execute(query,
                                                context_value=request))
        self.assertEqual(mock_background_task.call_count, 2)

    def test_update_event_as_creator(self):
        query = """
            mutation UpdateEvent{
            updateEvent(input:{
                eventId:"RXZlbnROb2RlOjU=",
                title:"Not really a party"
            }){
                updatedEvent{
                id
                title
                }
                actionMessage
            }
            }
        """
        request = self.request
        client = self.client
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))

    def test_update_event_as_non_creator(self):
        query = """
            mutation UpdateEvent{
            updateEvent(input:{
                eventId:"RXZlbnROb2RlOjU=",
                title:"it really is a party"
            }){
                updatedEvent{
                id
                title
                }
                actionMessage
            }
            }
        """
        request = self.request
        client = self.client
        request.user = self.non_event_creator.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))

    def test_update_event_as_admin(self):
        query = """
            mutation UpdateEvent{
                updateEvent(input:{
                    eventId:"RXZlbnROb2RlOjU=",
                    title:"This is a test don't panic."
                }){
                    updatedEvent{
                    id
                    title
                    }
                    actionMessage
                }
            }
        """
        request = self.request
        client = self.client
        request.user = self.admin.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))

    def test_query_updated_event(self):
        query = """
        query FetchUpdatedEvent{
            event(id:"RXZlbnROb2RlOjU="){
                id
                title
                description
                socialEvent{
                    id
                }
            }
        }
        """
        request = self.request
        client = self.client
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))

    def test_create_event_with_calendar_unauthorizd(self):

        query = f"""
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
        with suppress(UnauthorizedCalendarError):
            request = self.request
            client = self.client
            request.user = self.event_creator.user
            self.assertMatchSnapshot(client.execute(query,
                                                    context_value=request))

    @mock.patch('graphql_schemas.event.schema.send_calendar_invites')
    def test_create_event_with_calendar_authorized(self, mock_send_calendar):

        query = f"""
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
        client = self.client
        authorized_calendar_user = create_user(
            'authorizedTestId', calendar_authorized=True)
        request.user = authorized_calendar_user.user
        self.assertMatchSnapshot(client.execute(query,
                                                context_value=request))

    def test_send_event_invite(self):
        query = f"""
            mutation SendInvite {{
                sendEventInvite(input: {{
                    eventId: "{to_global_id("EventNode", self.user_event.id)}",
                    receiverEmail: "{self.non_event_creator.user.email}"
                }})
                {{ message }}
            }}
        """

        self.request.user = self.event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
        self.assertEqual(len(mail.outbox), 1)

    def test_send_invite_for_invalid_event(self):
        query = f"""
            mutation SendInvite {{
                sendEventInvite(input: {{
                    eventId: "{to_global_id("EventNode", 365)}",
                    receiverEmail: "{self.non_event_creator.user.email}"
                }})
                {{ message }}
            }}
        """

        self.request.user = self.event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_send_invite_to_invalid_user(self):
        query = f"""
            mutation SendInvite {{
                sendEventInvite(input: {{
                    eventId: "{to_global_id("EventNode", self.user_event.id)}",
                    receiverEmail: "invalid@andela.com"
                }})
                {{ message }}
            }}
        """

        self.request.user = self.event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_send_invite_to_self(self):
        query = f"""
            mutation SendInvite {{
                sendEventInvite(input: {{
                    eventId: "{to_global_id("EventNode", self.user_event.id)}",
                    receiverEmail: "{self.event_creator.user.email}"
                }})
                {{ message }}
            }}
        """

        self.request.user = self.event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link(self):
        event_id = self.user_event.id
        receiver_id = self.non_event_creator.user.id
        sender_id = self.event_creator.user.id

        hash_string = Hasher.gen_hash([
            event_id, receiver_id, sender_id])
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        endDate
                        startDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.non_event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link_invalid_event(self):
        event_id = 365
        receiver_id = self.non_event_creator.user.id
        sender_id = self.event_creator.user.id

        hash_string = Hasher.gen_hash([
            event_id, receiver_id, sender_id])
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        endDate
                        startDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.non_event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link_invalid_sender(self):
        event_id = self.user_event.id
        receiver_id = self.non_event_creator.user.id
        sender_id = 365

        hash_string = Hasher.gen_hash([
            event_id, receiver_id, sender_id])
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        startDate
                        endDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.non_event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link_unauthorized_user(self):
        event_id = self.user_event.id
        receiver_id = self.non_event_creator.user.id
        sender_id = self.event_creator.user.id

        hash_string = Hasher.gen_hash([
            event_id, receiver_id, sender_id])
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        startDate
                        endDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link_invalid_hash(self):
        hash_string = "amanhasnoname"
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        startDate
                        endDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.non_event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_validate_invite_link_expired_event(self):
        self.user_event.end_date = past_date
        self.user_event.save()
        event_id = self.user_event.id
        receiver_id = self.non_event_creator.user.id
        sender_id = self.event_creator.user.id

        hash_string = Hasher.gen_hash([
            event_id, receiver_id, sender_id])
        query = f"""
            mutation ValidateInvite {{
                validateEventInvite(input: {{
                    hashString: "{hash_string}"
                }})
                {{
                    isValid
                    event {{
                        title
                        description
                        venue
                        startDate
                        endDate
                        active
                    }}
                    message
                }}
            }}
        """

        self.request.user = self.non_event_creator.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_event_with_an_existing_location(self):
        query = f"""
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

        query = """
            query {
                eventsList(location_Icontains:"San-Fransisco"){
                    edges{
                    node{
                        id
                        }
                    }
                }
            }
        """
        request = self.request
        client = self.client
        request.user = self.admin.user
        response = client.execute(query, context_value=request)
        self.assertMatchSnapshot(response)

    def test_event_with_non_exixting_location(self):
        query = """
            query {
                eventsList(location_Icontains:"Andela-lagos"){
                    edges{
                    node{
                        id
                        }
                    }
                }
            }
        """
        request = self.request
        client = self.client
        request.user = self.admin.user
        response = client.execute(query, context_value=request)
        self.assertMatchSnapshot(response)
