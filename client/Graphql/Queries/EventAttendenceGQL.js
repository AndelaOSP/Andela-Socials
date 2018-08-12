import gql from 'graphql-tag';

const EVENT_ATTENDENCE_GQL = (id = '') => ({
  query: gql`
    query($id: ID!){
      eventAttendance(id: $id){
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
  variables: {
    id,
  },
});

export default EVENT_ATTENDENCE_GQL;
