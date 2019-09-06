import gql from 'graphql-tag';

const INTEREST_GQL = (id = '') => ({
  query: gql`
    query($id: ID!){
      interest(id: $id){
        createdAt
        updatedAt
        id
        followerCategory{
          createdAt
          updatedAt
          id
          name
          featuredImage
          description
          events{
            pageInfo{
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges{
              node{
                createdAt
                updatedAt
                id
                title
                description
                venue
                date
                time
                socialEvent{
                  name
                }
                featuredImage
                active
              }
              cursor
            }
          }
        }
      }
    }`,
  variables: {
    id,
  },
});

export default INTEREST_GQL;
