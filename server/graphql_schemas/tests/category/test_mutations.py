import logging
from django.db import transaction

from graphql_relay import to_global_id
from api.models import Category
from .base import BaseCategoryTestCase

logging.disable(logging.ERROR)


class CategoryTestCase(BaseCategoryTestCase):
    """
    Test attend mutation queries
    """

    def test_user_can_create_a_new_category(self):
        query = '''
        mutation subscribe {
            createCategory(input: {
                name: "someCategory",
                description: "testCategory is still a test",
                featuredImage: "https://github.com",
            })
            {
                clientMutationId
                newCategory {
                  name
                  description
                  featuredImage
                }
            }
        }
        '''

        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

