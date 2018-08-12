import gql from 'graphql-tag';

const UPDATE_EVENT_GQL = (eventId, title, description, featuredImage, venue, date, time, socialEventId) => ({
  mutation: gql`
    mutation($input: UpdateEventInput!){
      updateEvent(input: $input){
        updatedEvent{
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
      date,
      time,
      socialEventId,
    },
  },
});

export default UPDATE_EVENT_GQL;
