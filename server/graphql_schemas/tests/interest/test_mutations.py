from .base import BaseEventTestCase


class InterestTestCase(BaseEventTestCase):
    """
    Test interest  queries
    """

    def test_user_can_join_and_unjoin_category(self):
        # Test for joining a category
        query = '''
        mutation{
            joinCategory(input:{
                categoryId:"Q2F0ZWdvcnlOb2RlOjI="
            }){
                joinedCategory{
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

        # Tests unjoining a category
        query = '''
        mutation{
            UnJoinCategory(input:{
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

    def test_user_cannot_unjoin_category_they_do_not_belong_to(self):
        query = '''
        mutation{
            unJoinCategory(input:{
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
