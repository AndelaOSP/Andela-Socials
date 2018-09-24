import { OAUTH } from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for setting Oauth Message
 * 
 * @param {string} [state=initialState.access]
 * @param {object} action
 * @returns {object} redirectUrl state
 */
const oauth = (state = initialState.oauth, action) => {
  switch (action.type) {
    case OAUTH:
      return action.payload;

    default:
      return state;
  }
};

export default oauth;
