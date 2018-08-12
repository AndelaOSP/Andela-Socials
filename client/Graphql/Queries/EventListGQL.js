import gql from 'graphql-tag';

const EVENT_LIST_GQL = (before = '', after = '', first = 1, last = 1) => ({
  query: gql`
    query(
      $before: String,
      $after: String,
      $first: Int,
      $last: Int
    ){
      eventsList(
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
    }`,
  variables: {
    before,
    after,
    first,
    last,
  },
});
export default EVENT_LIST_GQL;
