import gql from 'graphql-tag';

const REMOVE_INTEREST_GQL = (interestsId, clientMutationId = '') => ({
  mutation: gql`
   mutation($input: UnJoinCategoryInput!){
    unjoinCategory(input: $input){
      unjoinedCategories{
        id
        followerCategory{
         id
         name
      }
    }
    clientMutationId
      }
     
   }`,
  variables: {
    input: {
      categories: interestsId,
      clientMutationId
    }
  },
});

export default REMOVE_INTEREST_GQL;