import gql from 'graphql-tag';

const CREATE_EVENT_GQL = (
  title,
  description,
  featuredImage,
  venue,
  startDate,
  endDate,
  timezone,
  categoryId,
  slackChannel
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
          slackChannel
          socialEvent{
            name
          }
          active
        }
        slackToken
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
      slackChannel,
      categoryId,
    },
    },
});
export default CREATE_EVENT_GQL;
