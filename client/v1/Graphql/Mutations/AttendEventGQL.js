import gql from 'graphql-tag';

const ATTEND_EVENT_GQL = (eventId, clientMutationId = '', status = 'attending') => ({
  mutation: gql`
    mutation($input: AttendEventInput!){
      attendEvent(input: $input){
        newAttendance{
          id
          createdAt
          updatedAt
          status
          event{
            createdAt
            updatedAt
            id
            title
            description
            venue
            startDate
            endDate
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
      status,
    },
  },
});
export default ATTEND_EVENT_GQL;
