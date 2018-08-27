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

    def test_query_single_event(self):
        query = """
        query {
            event(id:"RXZlbnROb2RlOjU="){
                id
                description
                title
                active 
            }
        }
        """
        request = self.request
        client = self.client
        request.user = self.admin.user
        self.assertMatchSnapshot(client.execute(query,
                                 context_value=request))

    def test_get_event_list(self):
        query = """
        query {
          eventsList {
            edges {
              node {
                id
                title
                description
                startDate
                venue
                socialEvent    {
                id
                name			
                            }
                        }
                cursor		
                    }
                }
            }"""
        request = self.request
        client = self.client
        request.user = self.admin.user
        response = client.execute(query, context_value=request)
        self.assertMatchSnapshot(response)

    def test_filter_event_list_by_valid_venue_is_successful(self):
        query = """
        query {
          eventsList(venue: "") {
            edges {
              node {
                id
                title
                description
                startDate
                venue
                socialEvent    {
                id
                name			
                            }
                        }
                cursor		
                    }
                }
            }"""
        request = self.request
        client = self.client
        request.user = self.admin.user
        response = client.execute(query, context_value=request)
        self.assertMatchSnapshot(response)

    def test_filter_event_list_by_non_existing_venue_returns_empty_list(self):
        query = """
        query {
          eventsList(venue: "test place") {
            edges {
              node {
                id
                title
                description
                startDate
                venue
                socialEvent    {
                id
                name			
                            }
                        }
                cursor		
                    }
                }
            }"""
        request = self.request
        client = self.client
        request.user = self.admin.user
        response = client.execute(query, context_value=request)
        self.assertMatchSnapshot(response)
