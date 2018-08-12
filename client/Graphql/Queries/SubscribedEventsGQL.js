import gql from 'graphql-tag';

const SUBSCRIBED_EVENTS_GQL = () => ({
  query: gql`
    query{
      subscribedEvents{
        id
        createdAt
        updatedAt
        event{
          createdAt
          updatedAt
          id
          time
          title
          description
          venue
          date
          featuredImage
          active
        }
      }
    }`,
});
export default SUBSCRIBED_EVENTS_GQL;
