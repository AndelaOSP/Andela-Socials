
from contextlib import suppress
from graphql import GraphQLError

from .base import BaseEventTestCase, create_event


class MutateEventTestCase(BaseEventTestCase):
    """
    Tests the events api queries and mutations
    """
    def test_deactivate_event_as_creator(self):
        query = """
            mutation {
                deactivateEvent(input: {eventId: 1}) {
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
                deactivateEvent(input: {eventId: 1}) {
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
            deactivateEvent(input: {eventId: 1}) {
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
                eventId:"RXZlbnROb2RlOjE=",
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
                eventId:"RXZlbnROb2RlOjE=",
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
                    eventId:"RXZlbnROb2RlOjE=",
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
            event(id:"RXZlbnROb2RlOjE="){
                id
                title
                description
            }
        }
        """
        request = self.request
        client = self.client
        create_event(self.admin, self.category, id=2)
        request.user = self.event_creator.user
        self.assertMatchSnapshot(client.execute(query, context_value=request))
