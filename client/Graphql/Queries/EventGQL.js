import gql from 'graphql-tag';

const EVENT_GQL = (id = '') => ({
  query: gql`
    query($id: ID!){
      event(id: $id){
        createdAt
        updatedAt
        id
        time
        title
        description
        venue
        date
        featuredImage
        active
      }
    }`,
  variables: {
    id,
  },
});

export default EVENT_GQL;
