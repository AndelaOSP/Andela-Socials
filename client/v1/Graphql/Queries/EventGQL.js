import gql from 'graphql-tag';

const EVENT_GQL = (id = '') => ({
  query: gql`
    query($id: ID!) {
      event(id: $id) {
        id
        title
        active
        description
        startDate
        endDate
        venue
        featuredImage
        timezone
        slackChannel
        creator {
          id
          googleId
        }        
        socialEvent {
          id
          name
        }
        attendSet {
          edges {
            node {
              user {
                id
                slackId
                googleId
              }
            }
          }
        }
      }
    }
  `,
  variables: { id },
});

export default EVENT_GQL;
