import gql from 'graphql-tag';

const UPLOAD_IMAGE_GQL = featuredImage => ({
  mutation: gql`
    mutation($input: UploadImageInput!){
      uploadImage(input: $input){
        responseMessage
        imageUrl
      }
    }`,
  variables: { input: { featuredImage } },
});

export default UPLOAD_IMAGE_GQL;
