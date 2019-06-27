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
<<<<<<< HEAD
<<<<<<< HEAD
      categoryId,
      slackChannel
=======
      categoryId
>>>>>>> (ft-event-host-add-channel-165998501) Event host should be able to add a discussion/group slack channel to an event (#202)
=======
      categoryId,
      slackChannel
>>>>>>>   (ft-add-change-slack-channel-166607535): User should be able to add/change slack channel for an existing event (#235)
    },
  },
});

export default UPDATE_EVENT_GQL;
