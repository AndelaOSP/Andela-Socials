import gql from 'graphql-tag';

const CREATE_INTEREST_GQL = (interestsId, clientMutationId = '') => ({
  mutation: gql`
   mutation($input: JoinCategoryInput!){
    joinCategory(input: $input){
      joinedCategoryList{
        id
        followerCategory{
         createdAt
         updatedAt
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

export default CREATE_INTEREST_GQL;
