import gql from 'graphql-tag';

const CREATE_EVENT_GQL = (
  title,
  description,
  featuredImage,
  venue,
  startDate,
  endDate,
  timezone,
  categoryId
) => ({
  mutation: gql`
    mutation($input: CreateEventInput!){
      createEvent(input: $input){
        newEvent{
          createdAt
          updatedAt
          id
          timezone
          title
          description
          venue
          startDate
          endDate
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
      startDate,
      endDate,
      timezone,
      categoryId,
    },
  },
});

export default CREATE_EVENT_GQL;
