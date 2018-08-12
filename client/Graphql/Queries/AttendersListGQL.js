import gql from 'graphql-tag';

const ATTENDERS_LIST_GQL = (before = '', after = '', first = 1, last = 1) => ({
  query: gql`
    query(
      $before: String,
      $after: String,
      $first: Int,
      $last: Int,
    ){
      attendersList(
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
            id
            createdAt
            updatedAt
            event{
              createdAt
              updatedAt
              id
              title
              description
              venue
              date
              time
              featuredImage
              active
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
export default ATTENDERS_LIST_GQL;
