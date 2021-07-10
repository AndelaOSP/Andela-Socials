import initialState from './initialState';
import {
  INTEREST,
  INTERESTS,
  SIGN_OUT,
  CREATE_INTERESTS,
  JOINED_CATEGORIES,
} from '../actions/constants';

/**
 * Reducer for interests
 * @param {object} [state=initialState.interests]
 * @param {object} action
 * @returns {array} new state of interests
 */
const interests = (state = initialState.interests, action) => {
  switch (action.type) {

    case JOINED_CATEGORIES:
    case INTERESTS:
      return Object.assign({}, state, { interests: action.payload });

    case INTEREST:
      return Object.assign(
        {},
        state,
        {
          interest: state.interests.interestsList.edges
            .filter(item => item.node.id === action.payload.id),
        }
      );

    case CREATE_INTERESTS:
      return Object.assign({}, state, { interests: action.payload });

    case SIGN_OUT:
      return Object.assign({}, state, {
        interests: initialState.interests, interest: initialState.interest,
      });

    default:
      return state;
  }
};

export default interests;
