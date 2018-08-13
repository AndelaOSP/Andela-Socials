import axios from 'axios';
import { SET_REDIRECT_URL, SIGN_OUT, SIGN_IN } from './constants';
import { authenticationFailed } from '../utils/errorHandler';

export const login = (payload, type) => ({
  payload,
  type,
  error: false,
});

export const setRedirectUrl = url => ({
  type: SET_REDIRECT_URL,
  payload: url,
});

export const signOut = () => ({
  type: SIGN_OUT,
});

export const signIn = token => dispatch => axios
  .post('/api/v1/auth/login/', {
    ID_Token: token,
  })
  .then(res => dispatch(login(res, SIGN_IN)))
  .catch(error => authenticationFailed(error));
