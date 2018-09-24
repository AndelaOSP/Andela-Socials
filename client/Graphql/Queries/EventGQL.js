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
        socialEvent {
          name
        }
        attendSet {
          edges {
            node {
              user {
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
