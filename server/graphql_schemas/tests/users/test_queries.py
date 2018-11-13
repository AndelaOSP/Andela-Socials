from .base import BaseUserTestCase
from graphql_relay import to_global_id


class QueryAndelaUserTestCase(BaseUserTestCase):
    """
    Test queries on events endpoint
    """

    def test_query_users_list(self):
        query = '''
        query {
            usersList {
                edges {
                    node {
                        id
                        userPicture
                        googleId
                    }
                }
            }
        }
        '''
        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_query_users_by_id(self):
        query = f'''
        query {{
            user(id:"{to_global_id("AndelaUserNode",
            self.andela_user2.id)}"){{
                id
                userPicture
                googleId
            }}
        }}
        '''
        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
