from .base import BaseEventTestCase


class CategoryTestCase(BaseEventTestCase):
    """
    Test category  queries
    """

    def test_can_fetch_all_categories(self):
        query = '''
        query{
            categoryList{
                edges{
                node{
                    id
                    name
                    description
                    featuredImage
                }
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_can_fetch_single_category(self):
        query = '''
        query{
            category(id:"Q2F0ZWdvcnlOb2RlOjE="){
                id
                name
                description
                featuredImage
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
