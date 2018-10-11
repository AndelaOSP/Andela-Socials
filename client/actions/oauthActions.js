import { handleError, handleInformation } from '../utils/errorHandler';
import apiCall from '../utils/api';
import { OAUTH } from './constants';

/**
 * Callback action
 *
 * @param {string} authUrl
 * @return {{type: (object}}
 */
// eslint-disable-next-line
 export const savePermission = (authUrl) => dispatch => apiCall(
  `/api/v1/oauthcallback${authUrl}`, 'get'
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
