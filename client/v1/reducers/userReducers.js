import {
  LOAD_ACTIVE_USER_SUCCESS,
  SIGN_OUT,
} from '../actions/constants';

import initialState from './initialState';

/**
 * User reducer
 *
 * @export
 * @param {object} [state= initialState.activeUser]
 * @param {object} action
 * @returns {object} state
 */

const userReducers = (state = initialState.activeUser, action) => {
  switch (action.type) {
    case LOAD_ACTIVE_USER_SUCCESS:
      return action.activeUser;

    case SIGN_OUT:
      return {};

    default:
      return state;
  }
};

export default userReducers;
