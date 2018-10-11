import { VALIDATE_INVITE } from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for invite hashKey validation
 * @param {object} [state=initialState.invite]
 * @param {object} action
 * @returns {object} new state with invite details
 */
export const inviteValidation = (state = initialState.invite, action) => {
  switch (action.type) {
    case VALIDATE_INVITE:
      return action.payload.validateEventInvite;
    default:
      return state;
  }
};

export default inviteValidation;
