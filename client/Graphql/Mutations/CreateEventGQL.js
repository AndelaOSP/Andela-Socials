import gql from 'graphql-tag';

const CREATE_EVENT_GQL = (title, description, featuredImage, venue, date, time, socialEventId) => ({
  mutation: gql`
    mutation($input: CreateEventInput!){
      createEvent(input: $input){
        newEvent{
          createdAt
          updatedAt
          id
          time
          title
          description
          venue
          date
          featuredImage
          socialEvent{
            name
          }
          active
        }
        clientMutationId
      }
    }`,
  variables: {
    input: {
      title,
      description,
      featuredImage,
      venue,
      date,
      time,
      socialEventId,
    },
  },
});

export default CREATE_EVENT_GQL;
