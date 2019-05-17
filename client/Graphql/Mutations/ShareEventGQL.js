import gql from 'graphql-tag';

const SHARE_EVENT_GQL = (
  eventId,
  channelId,
) => ({
  mutation: gql`
      mutation($input: ShareEventInput!) {
        shareEvent(input: $input){
          event {
            title
            description
          }
        }
    }`,
  variables: {
    input: {
      eventId,
      channelId,
    },
  },
});

export default SHARE_EVENT_GQL;
