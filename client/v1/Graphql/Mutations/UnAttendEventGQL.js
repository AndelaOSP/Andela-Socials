import gql from 'graphql-tag';

const UNATTEND_EVENT_GQL = (eventId, clientMutationId = '') => ({
  mutation: gql`
    mutation($input: UnsubscribeEventInput!){
      unattendEvent(input: $input){
        unsubscribedEvent{
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
        clientMutationId
      }
    }`,
  variables: {
    input: {
      eventId,
      clientMutationId,
    },
  },
});

export default UNATTEND_EVENT_GQL;
