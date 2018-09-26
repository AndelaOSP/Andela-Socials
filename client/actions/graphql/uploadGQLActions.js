import UPLOAD_IMAGE_GQL from '../../Graphql/Mutations/UploadImageGQL';

import { UPLOAD_IMAGE } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';


const uploadImage = ({ featuredImage }) => dispatch => Client.mutate(
  UPLOAD_IMAGE_GQL(featuredImage)
).then(response => dispatch({
  type: UPLOAD_IMAGE,
  payload: response.data,
  error: false,
})).catch((error) => {
  handleError(error, dispatch);
});

export default uploadImage;
