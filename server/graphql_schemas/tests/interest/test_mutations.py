from .base import BaseEventTestCase


class InterestTestCase(BaseEventTestCase):
    """
    Test interest  queries
    """

    def test_user_can_join_and_unjoin_social_club(self):
        # Test for joining a social club
        query = '''
        mutation{
            joinSocialClub(input:{
                clubId:"Q2F0ZWdvcnlOb2RlOjI="
            }){
                joinedSocialClub{
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

        # Tests unjoining a social club
        query = '''
        mutation{
            unJoinSocialClub(input:{
                clubId:"Q2F0ZWdvcnlOb2RlOjI="
            }){
                unjoinedSocialClub{
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

    def test_user_cannot_unjoin_social_club_they_do_not_belong_to(self):
        query = '''
        mutation{
            unJoinSocialClub(input:{
                clubId:"Q2F0ZWdvcnlOb2RlOjI="
            }){
                unjoinedSocialClub{
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
