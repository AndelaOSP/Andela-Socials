import gql from 'graphql-tag';

const UPDATE_EVENT_GQL = (eventId, title, description, featuredImage, venue, startDate, endDate, timezone, categoryId, slackChannel) => ({
  mutation: gql`
    mutation($input: UpdateEventInput!){
      updateEvent(input: $input){
        updatedEvent{
          id
          title
          active
          description
          startDate
          endDate
          venue
          featuredImage
          timezone
          slackChannel
          creator {
            id
            googleId
          }        
          socialEvent {
            id
            name
          }
          attendSet {
            edges {
              node {
                user {
                  id
                  slackId
                  googleId
                }
              }
            }
          }
        }
		    actionMessage
	  	  clientMutationId
	    }
    }`,
  variables: {
    input: {
      eventId,
      title,
      description,
      featuredImage,
      venue,
      startDate,
      endDate,
      timezone,
      categoryId,
      slackChannel
    },
  },
});

export default UPDATE_EVENT_GQL;
