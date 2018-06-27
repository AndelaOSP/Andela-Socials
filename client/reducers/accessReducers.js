import { SIGN_IN_SUCCESS, SIGN_OUT } from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for user access or authentication
 * @param {object} [state=initialState.access]
 * @param {object} action
 * @returns {object} access state
 */
const access = (state = initialState.access, action) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.payload
      };

    case SIGN_OUT:
      return initialState.access;

    default:
      return state;
  }
}

export default access;
