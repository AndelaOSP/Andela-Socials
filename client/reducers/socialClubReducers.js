import {
  GET_CLUBS,
  GET_CLUB,
  JOINED_CLUBS,
  JOIN_CLUB,
  UNJOIN_CLUB,
  SIGN_OUT,
} from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for socialClubs
 * @param {array} [state=initialState.socialClubs]
 * @param {object} action
 * @returns {array} new state of socialClubs
 */
export const socialClubs = (state = initialState.socialClubs, action) => {
  switch (action.type) {
    case GET_CLUBS:
      return Object.assign({}, state, { socialClubs: action.payload });

    case GET_CLUB:
      return Object.assign(
        {},
        state,
        {
          socialClub: state.socialClubs.categoryList.edges
            .filter(item => item.node.id === action.payload.id),
        }
      );

    case SIGN_OUT:
      return Object.assign({}, state, {
        socialClubs: initialState.socialClubs, socialClub: initialState.socialClub,
      });

    default:
      return state;
  }
};

/**
 * Reducer for joinedCategories
 * @param {object} [state=initialState.joinedCategories]
 * @param {object} action
 * @returns {array} new state of joinedCategories
 */
export const joinedCategories = (state = initialState.joinedCategories, action) => {
  switch (action.type) {
    case JOINED_CLUBS:
      return Object.assign({}, state, { joinedCategories: action.payload.joinedCategories });

    case JOIN_CLUB:
      return Object.assign({}, state, {
        joinedCategories: state.joinedCategories.concat(
          action.payload.joinCategory.joinedCategory
        ),
      });

    case UNJOIN_CLUB:
      return Object.assign({}, state, {
        joinedCategories: state.joinedCategories.filter(
          club => club.followerCategory.id !== action.payload.unjoinCategory
            .unjoinedCategory.followerCategory.id
        ),
      });

    case SIGN_OUT:
      return Object.assign({}, state, { joinedCategories: initialState.joinedCategories });

    default:
      return state;
  }
};
