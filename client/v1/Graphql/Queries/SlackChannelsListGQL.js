import gql from 'graphql-tag';

const SLACK_CHANNELS_LIST_GQL = () => ({
  query: gql`
    query {
      slackChannelsList {
        ok
        channels {
          id,
          name,
          creator,
          created,
          isGroup
        }
      }
    }
  `
});

export default SLACK_CHANNELS_LIST_GQL;
