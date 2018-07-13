from .base import BaseEventTestCase


class QueryEventTestCase(BaseEventTestCase):
    """
    Test queries on events endpoint

    """

    def test_query_deactivated_event(self):
        query = """
        query {
            eventsList {
                edges {
                    node {
                        id
                        description
                        title
                        active
                    }
                }
            }
        }
        """
        request = self.request
        client = self.client
        request.user = self.admin.user
        self.assertMatchSnapshot(client.execute(query,
                                 context_value=request))
