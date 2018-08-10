from .base import BaseEventTestCase


class QueryAndelaUserTestCase(BaseEventTestCase):
    """
    Test queries on events endpoint

    """
    def test_query_users_list(self):
        query = """
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
        """
        self.request.user = self.user1
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)


    def test_query_users_by_id(self):
        query = """
        query {
            user(id:"QW5kZWxhVXNlck5vZGU6OTg="){
                id
                userPicture
                googleId
            }
        }
        """
        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)