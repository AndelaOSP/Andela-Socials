from .base import BaseEventTestCase


class CategoryTestCase(BaseEventTestCase):
    """
    Test interest  queries
    """

    def test_can_fetch_all_interests(self):
        query = '''
        query{
            interestsList{
                edges{
                node{
                    id
                    followerCategory{
                        id
                        name
                    }
                }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
