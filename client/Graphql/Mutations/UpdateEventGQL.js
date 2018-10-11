import gql from 'graphql-tag';

const UPDATE_EVENT_GQL = (eventId, title, description, featuredImage, venue, startDate, endDate, timezone, categoryId) => ({
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
    },
  },
});

export default UPDATE_EVENT_GQL;
