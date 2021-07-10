import initialState from './initialState';
import {
  CHANNELS
} from '../actions/constants';

/**
 * Reducer for slackChannels
 * @param {object} [state=initialState.slackChannels]
 * @param {object} action
 * @returns {array} new state of interests
 */
const slackChannels = (state = initialState.slackChannels, action) => {
  switch (action.type) {
    case CHANNELS:
      return action.payload.slackChannelsList;

    default:
      return state;
  }
};

export default slackChannels;
