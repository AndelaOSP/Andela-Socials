import gql from 'graphql-tag';

//To get all all the interests of a user
const JOINED_CATEGORIES_GQL = () => ({
  query: gql`
    query{
      joinedCategories{
        createdAt
        updatedAt
        id
        followerCategory{
            id
            name
            featuredImage
            description
        }
      }
    }`,
});

export default JOINED_CATEGORIES_GQL;
