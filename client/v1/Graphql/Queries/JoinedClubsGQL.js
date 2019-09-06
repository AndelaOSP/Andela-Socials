import gql from 'graphql-tag';

const JOINED_CLUBS_GQL = () => ({
  query: gql`
    query{
      joinedClubs{
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
});

export default JOINED_CLUBS_GQL;
