import {GET_CLUBS, GET_CLUB, JOINED_CLUBS, JOIN_CLUB, UNJOIN_CLUB, CREATE_EVENT, SIGN_OUT } from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for socialClubs
 * @param {array} [state=initialState.socialClubs]
 * @param {object} action
 * @returns {array} new state of socialClubs
 */
export const socialClubs = (state = initialState.socialClubs, action) => {
  switch(action.type){
    case GET_CLUBS:
      return action.payload;

    case SIGN_OUT:
      return initialState.socialClubs;

    default:
      return state;
  }
}

/**
 * Reducer for one socialClub
 * @param {object} state
 * @param {object} action
 * @returns {array} new state of the socialClub
 */
export const socialClub = (state = initialState.socialClub, action) => {
  switch(action.type){
    case GET_CLUB:
      return action.payload;

    case CREATE_EVENT:
      return Object.assign({}, state, {
        events: state.events.concat(action.payload)
      });

    case SIGN_OUT:
      return initialState.socialClub;

    default:
      return state;
  }
}

/**
 * Reducer for joined clubs
 * @param {object} state
 * @param {object} action
 * @returns {array} new state of joined clubs
 */
export const joinedClubs = (state = initialState.joinedClubs, action) => {
  switch(action.type){
    case JOINED_CLUBS:
      return action.payload.map(interest => interest.follower_category);

    case JOIN_CLUB:
      return state.concat(action.payload.follower_category);

    case UNJOIN_CLUB:
      return state.filter(club => club !== action.payload.club_id);

    default:
      return state;
  }
}
