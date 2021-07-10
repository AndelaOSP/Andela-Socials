import gql from 'graphql-tag';

const DEACTIVATE_EVENT_GQL = (eventId, clientMutationId = '') => ({
  mutation: gql`
    mutation($input: DeactivateEventInput!){
      deactivateEvent(input: $input){
        actionMessage
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

export default DEACTIVATE_EVENT_GQL;

