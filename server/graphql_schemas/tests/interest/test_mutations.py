from .base import BaseEventTestCase
from graphql_relay import to_global_id
from django.db import transaction
from api.models import Interest


class InterestTestCase(BaseEventTestCase):
    """
    Test interest  queries
    """

    def test_user_can_join_and_unjoin_category(self):
        # Test for joining a category
        query = f'''
        mutation{{
            joinCategory(input:{{
                categoryId:"{to_global_id("CategoryNode", self.category2.id)}",
            }}){{
                joinedCategory{{
                id
                followerCategory{{
                    id
                    name
                    description
                }}
                }}
            }}
            }}
        '''

        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

        # Tests unjoining a category
        query = f'''
        mutation{{
            unjoinCategory(input:{{
                categoryId:"{to_global_id("CategoryNode", self.category2.id)}",
            }}){{
                unjoinedCategory{{
                id
                followerCategory{{
                    id
                    name
                    description
                }}
                }}
            }}
            }}
        '''

        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)

    def test_user_cannot_join_same_category_twice(self):
        query = f'''
        mutation{{
            joinCategory(input:{{
                categoryId:"{to_global_id("CategoryNode", self.category2.id)}",
            }}){{
                joinedCategory{{
                id
                followerCategory{{
                    id
                    name
                    description
                }}
                }}
            }}
            }}
        '''
        with transaction.atomic():
            Interest.objects.create(
                follower=self.andela_user2,
                follower_category=self.category2
            )
            self.request.user = self.user2
            result = self.client.execute(query, context_value=self.request)
            self.assertMatchSnapshot(result)

    def test_user_cannot_unjoin_category_they_do_not_belong_to(self):
        query = '''
        mutation{
            unjoinCategory(input:{
                categoryId:"Q2F0ZWdvcnlOb2RlOjI="
            }){
                unjoinedCategory{
                id
                followerCategory{
                    id
                    name
                    description
                }
                }
            }
            }
        '''

        self.request.user = self.user2
        result = self.client.execute(query, context_value=self.request)
        self.assertMatchSnapshot(result)
