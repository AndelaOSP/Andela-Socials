import { SUBNAV_HIDDEN } from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for ui events
 * @param {object} [state=initialState.ui]
 * @param {object} action
 * @returns {object} new state with invite details
 */
export const uiReducers = (state = initialState.ui, { type, payload }) => {
  switch (type) {
    case SUBNAV_HIDDEN:
      return { subNavHidden: payload };
    default:
      return state;
  }
};

export default uiReducers;
