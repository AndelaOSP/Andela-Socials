import {
  LOAD_ACTIVE_USER_SUCCESS,
  SIGN_OUT,
} from './constants';

// utils
import decodeToken from '../utils/decodeToken';
import { handleError } from '../utils/errorHandler';

export const signOut = () => (dispatch) => {
  localStorage.removeItem('token');
  window.location = '/login';
  return dispatch({ type: SIGN_OUT });
};

/**
 * Load User action
 *
 * @param {object} activeUser
 * @return {{type: (string|LOAD_ACTIVE_USER_SUCCESS), activeUser}}
 */
const loadActiveUserSuccess = activeUser => ({
  type: LOAD_ACTIVE_USER_SUCCESS, activeUser,
});

/**
 * Load active user thunk
 *
 * @param {void}
 * @return {(dispatch:any)=>Promise<TResult2|TResult1>}
 */
export const loadActiveUser = () => ((dispatch) => {
  const activeUser = decodeToken();
  return dispatch(loadActiveUserSuccess(activeUser));
});

/**
 * Display login error message
 *
 * @param {void}
 * @return {(dispatch:any)=>Promise<TResult2|TResult1>}
 */
export const displayLoginErrorMessage = () => (
  dispatch => handleError('Unauthorised Access, Please Log in with an Andela Email', dispatch));
