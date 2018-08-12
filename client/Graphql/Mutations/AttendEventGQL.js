import gql from 'graphql-tag';

const ATTEND_EVENT_GQL = (eventId, clientMutationId = '') => ({
  mutation: gql`
    mutation($input: AttendSocialEventInput!){
      attendEvent(input: $input){
        newAttendance{
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
export default ATTEND_EVENT_GQL;
