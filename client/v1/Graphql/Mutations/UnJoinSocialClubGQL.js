import gql from 'graphql-tag';

const UNJOIN_SOCIAL_CLUB_GQL = (clubId, clientMutationId = '') => ({
  mutation: gql`
    mutation($input: UnJoinSocialClubInput!){
        unJoinSocialClub(input: $input){
          unjoinedSocialClub{
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

export default UNJOIN_SOCIAL_CLUB_GQL;
