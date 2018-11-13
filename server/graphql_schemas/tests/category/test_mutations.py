import logging

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

    def test_user_cannnot_create_exact_category_twice(self):
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
        Category.objects.create(
            name="someCategory",
            description="testCategory is still a test",
            featured_image="https://github.com",
        )
        self.request.user = self.user
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannnot_create_category_with_existing_name(self):
        query = '''
        mutation subscribe {
            createCategory(input: {
                name: "Swimming Meetup 1",
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
