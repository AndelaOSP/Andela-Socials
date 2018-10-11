import gql from 'graphql-tag';

export const VALIDATE_EVENT_INVITE_GQL = (hashString, clientMutationId = '') => ({
  mutation: gql`
    mutation($input:  ValidateEventInviteInput!){
      validateEventInvite(input: $input){
        message,
        isValid,
        event{
          id
          title
          featuredImage
          startDate
          venue
          endDate
          active
      },
        clientMutationId
      }
    }`,
  variables: {
    input: {
      hashString,
      clientMutationId,
    },
  },
});
export default VALIDATE_EVENT_INVITE_GQL;
