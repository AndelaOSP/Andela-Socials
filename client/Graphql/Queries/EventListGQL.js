import gql from 'graphql-tag';

const EVENT_LIST_GQL = (after = '', first = 1, title, startDate, venue,
  category) => ({
  query: gql`
    query(
      $after: String,
      $first: Int,
      $startDate: String,
      $venue: String,
      $category: ID,
      $title: String
    ){
      eventsList(
        after: $after
        first: $first
        startDate_Istartswith: $startDate,
        venue: $venue
        socialEvent: $category
        title_Istartswith: $title
      ){
        edges{
          node{
            id
            title
            description
            venue
            startDate
            featuredImage
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
    after,
    first,
    title,
    startDate,
    venue,
    category,
  },
});
export default EVENT_LIST_GQL;
