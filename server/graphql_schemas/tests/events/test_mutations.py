from contextlib import suppress
from graphql import GraphQLError
from graphql_schemas.utils.helpers import UnauthorizedCalendarError

from .base import BaseEventTestCase, create_event, create_user


class MutateEventTestCase(BaseEventTestCase):
    """
    Tests the events api queries and mutations
    """
    def test_deactivate_event_as_creator(self):
        query = """
            mutation {
                deactivateEvent(input: {eventId: 5}) {
                    actionMessage
                }
            } """
        request = self.request
        client = self.client
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query,
                                 context_value=request))

    def test_deactivate_event_as_non_creator(self):
        with suppress(GraphQLError):
            query = """
            mutation {
                deactivateEvent(input: {eventId: 5}) {
                    actionMessage
                }
            } """
            request = self.request
            client = self.client
            request.user = self.non_event_creator.user
            self.assertMatchSnapshot(client.execute(query,
                                     context_value=request))

    def test_deactivate_event_as_admin(self):
        query = """
        mutation {
            deactivateEvent(input: {eventId: 5}) {
                actionMessage
            }
        } """
        request = self.request
        client = self.client
        request.user = self.admin.user
        self.assertMatchSnapshot(client.execute(query,
                                 context_value=request))

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
                time
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
                time
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
                    time
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
        create_event(self.admin, self.category, id=2)
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))

    def test_create_event_with_calendar_unauthorizd(self):

        query = """
        mutation CreateEvent{
            createEvent(input: {
                title:"test-title",
                description:"test-description",
                venue:"test venue",
                time:"3PM",
                date:"2018/12/01",
                socialEventId: "Q2F0ZWdvcnlOb2RlOjE=",
                featuredImage: "http://fake-image.com"
            }){
                newEvent{
                title
                description
                }
            }
        }
        """
        with suppress(UnauthorizedCalendarError):
            request = self.request
            client = self.client
            request.user = self.event_creator.user
            self.assertMatchSnapshot(client.execute(query,
                                                    context_value=request))

    def test_create_event_with_calendar_authorized(self):

        query = """
        mutation CreateEvent{
            createEvent(input: {
                title:"test title",
                description:"test description",
                venue:"test venue",
                time:"3PM",
                date:"2018/12/01",
                socialEventId: "Q2F0ZWdvcnlOb2RlOjE=",
                featuredImage: "http://fake-image.com"
            }) {
                newEvent{
                title
                description
                }
            }
        }
        """
        request = self.request
        client = self.client
        authorized_calendar_user = create_user('authorizedTestId', calendar_authorized=True)
        request.user = authorized_calendar_user.user
        self.assertMatchSnapshot(client.execute(query,
                                                context_value=request))
