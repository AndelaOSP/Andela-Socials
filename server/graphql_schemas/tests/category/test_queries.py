from .base import BaseCategoryTestCase
from graphql_relay import to_global_id


class CategoryTestCase(BaseCategoryTestCase):
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
        query = f'''
        query{{
            category(id:"{to_global_id("CategoryNode", self.category.id)}"){{
                id
                name
                description
                featuredImage
            }}
        }}
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
