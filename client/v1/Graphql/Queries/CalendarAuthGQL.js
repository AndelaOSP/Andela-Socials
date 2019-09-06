import gql from 'graphql-tag';

const CALENDAR_URL_GQL = () => ({
  query: gql`
    query{
      calendarAuth{
        authUrl
      }
    }
    `
});

export default CALENDAR_URL_GQL;
