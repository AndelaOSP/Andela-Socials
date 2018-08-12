import gql from 'graphql-tag';

const INTERESTS_LIST_GQL = (before = '', after = '', first = 1, last = 1) => ({
  query: gql`
    query(
      $before: String,
      $after: String,
      $first: Int,
      $last: Int
    ){
      interestsList(
        before: $before
        after: $after
        first: $first
        last: $last
      ){
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
              name
              featuredImage
              description
            }
          }
          cursor
        }
      }
    }`,
  variables: {
    before,
    after,
    first,
    last,
  },
});

export default INTERESTS_LIST_GQL;
