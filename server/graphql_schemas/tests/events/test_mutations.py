from .base import BaseEventTestCase

from contextlib import suppress
from graphql import GraphQLError


class MutateEventTestCase(BaseEventTestCase):
    """
    Test queries on events endpoint

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
