import { handleError, handleInformation } from '../utils/errorHandler';
import apiCall from '../utils/api';
import { OAUTH } from './constants';

/**
 * Callback action
 *
 * @param {string} url
 * @return {{type: (object}}
 */
// eslint-disable-next-line import/prefer-default-export
export const savePermission = url => dispatch => apiCall(
  url, 'get'
)
  .then((res) => {
    handleInformation(res.data.message);
    return dispatch({
      type: OAUTH,
      payload: res.data.message,
      error: false,
    });
  })
  .catch((error) => {
    dispatch({
      type: OAUTH,
      payload: error.toString(),
      error: false,
    });
    return handleError(error, dispatch);
  });
