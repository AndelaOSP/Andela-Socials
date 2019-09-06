import gql from 'graphql-tag';

const JOIN_SOCIAL_CLUB_GQL = (clubId, clientMutationId = '') => ({
  mutation: gql`
    mutation($input: JoinSocialClubInput!){
      joinSocialClub(input: $input){
        joinedSocialClub{
          id
          createdAt
          updatedAt
          followerCategory{
            createdAt
            updatedAt
            id
            name
            featuredImage
            description
            events{
              edges{
                node{
                  createdAt
                  updatedAt
                  id
                  title
                  description
                  date
                  time
                }
              }
            }
          }
        }
        clientMutationId
      }
    }`,
  variables: {
    input: {
      clubId,
      clientMutationId,
    },
  },
});

export default JOIN_SOCIAL_CLUB_GQL;
