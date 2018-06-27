import {GET_EVENT, JOIN_EVENT, SUBSCRIBED_EVENTS, SIGN_OUT, UNSUBSCRIBE_EVENT} from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for one event
 * @param {object} state
 * @param {object} action
 * @returns {array} new state of the event
 */
export const event = (state = initialState.event, action) => {
  switch(action.type) {
    case GET_EVENT:
      return action.payload;

    case JOIN_EVENT:
      return Object.assign({}, state, {
        attendees: state.attendees.concat(action.payload)
      });

    case UNSUBSCRIBE_EVENT:
      return Object.assign({}, state, {
        attendees: state.attendees.filter(attendee => attendee.event !== action.payload.event_id)
      });

    case SIGN_OUT:
      return initialState.event;

    default:
      return state;
  }
}

/**
 * Reducer for all subscribed events
 * @param {array} [state=initialState.subscribedEvents]
 * @param {object} action
 * @returns {array} new state of subscribedEvents
 */
export const subscribedEvents = (state = initialState.subscribedEvents, action) => {
  switch(action.type) {
    case SUBSCRIBED_EVENTS:
      return action.payload.map(interest => interest.event);

    case JOIN_EVENT:
      return state.concat(action.payload.event);

    case UNSUBSCRIBE_EVENT:
      return state.filter(event => event !== action.payload.event_id);

    default:
      return state;
  }
}


