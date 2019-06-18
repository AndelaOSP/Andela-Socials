import initialState from './initialState';
import { SLACK_TOKEN } from '../actions/constants';


const slackTokenReducer = (state = initialState.slackToken, action) => {
  switch (action.type) {
    case SLACK_TOKEN:
      return action.payload.slackToken;
    default:
      return state;
  }
};

export default slackTokenReducer;
