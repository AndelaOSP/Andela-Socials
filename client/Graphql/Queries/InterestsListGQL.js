import gql from 'graphql-tag';

const INTERESTS_LIST_GQL = (before = '', after = '', first = 1, last = 1) => ({
  query: gql`
    query{
      interestsList{
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
            followerCategory{
              id
              name
              featuredImage
              description
            }
          }
          cursor
        }
      }
    }`
});

export default INTERESTS_LIST_GQL;
