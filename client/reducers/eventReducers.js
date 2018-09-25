import {
  GET_EVENT,
  ATTEND_EVENT,
  SUBSCRIBED_EVENTS,
  GET_EVENTS,
  LOAD_MORE_EVENTS,
  CREATE_EVENT,
  GET_ATTENDEES,
  GET_EVENT_ATTENDENCE,
  UNATTEND_EVENT,
  SEARCH_EVENTS,
  UPDATE_EVENT,
  DEACTIVATE_EVENT,
  SIGN_OUT,
  UPLOAD_IMAGE,
} from '../actions/constants';
import initialState from './initialState';

/**
 * Reducer for one events
 * @param {object} [state=initialState.events]
 * @param {object} action
 * @returns {array} new state of the events
 */
export const events = (state = initialState.events, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return [...action.payload];
    case LOAD_MORE_EVENTS:
      return [...state, ...action.payload];

    case CREATE_EVENT: {
      const newEvents = { node: action.payload.createEvent.newEvent };
      return [...state, newEvents];
    }

    case UPDATE_EVENT: {
      const updatedEvent = {
        eventsList: {
          edges: state.events.eventsList.edges.map((item) => {
            let newItem = {};
            if (item.node.id === action.payload.updateEvent.updatedEvent.id) {
              newItem = { node: action.payload.updateEvent.updatedEvent };
            }
            return newItem;
          }),
          pageInfo: state.events.eventsList.pageInfo,
        },
      };
      return Object.assign({}, state, { events: updatedEvent });
    }

    case DEACTIVATE_EVENT: {
      const deactivateEvent = {
        eventsList: {
          edges: state.events.eventsList.edges.filter(item => item.node.id !== action.payload.id),
          pageInfo: state.events.eventsList.pageInfo,
        },
      };
      return Object.assign({}, state, { events: deactivateEvent });
    }

    case SIGN_OUT:
      return Object.assign({}, state, {
        events: initialState.events,
        event: initialState.event,
      });

    default:
      return state;
  }
};

/**
 * Reducer for uploading an image
 * @param {object} [state=initialState.events]
 * @param {object} action
 * @param {array}
 */
export const uploadImage = (state = initialState.events, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE: {
      const imageUploaded = {
        node: action.payload.uploadImage,
        error: action.error,
      };
      return [...state, imageUploaded];
    }
    default:
      return state;
  }
};

/**
 * Reducer for one events
 * @param {object} [state=initialState.event]
 * @param {object} action
 * @returns {array} new state of the events
 */
export const eventReducer = (state = initialState.event, action) => {
  switch (action.type) {
    case GET_EVENT: {
      const { event } = action.payload.data;
      return event || {};
    }
    default:
      return state;
  }
};

/**
 * Reducer for one subscribedEvents
 * @param {object} [state=initialState.subscribedEvents]
 * @param {object} action
 * @returns {array} new state of the subscribedEvents
 */
export const subscribedEvents = (state = initialState.subscribedEvents, action) => {
  switch (action.type) {
    case SUBSCRIBED_EVENTS:
      return Object.assign({}, state, { subscribedEvents: action.payload.subscribedEvents });

    case ATTEND_EVENT:
      return Object.assign({}, state, { subscribedEvents: state.subscribedEvents.concat(action.payload.attendEvent.newAttendance) });

    case UNATTEND_EVENT:
      return Object.assign({}, state, {
        subscribedEvents: state.subscribedEvents.filter(
          item => item.event.id !== action.payload.unattendEvent.unsubscribedEvent.event.id
        ),
      });

    case SIGN_OUT:
      return Object.assign({}, state, { subscribedEvents: initialState.subscribedEvents });

    default:
      return state;
  }
};

/**
 * Reducer for one attendees
 * @param {object} [state=initialState.attendees]
 * @param {object} action
 * @returns {array} new state of the attendees
 */
export const attendees = (state = initialState.attendees, action) => {
  switch (action.type) {
    case GET_ATTENDEES:
      return Object.assign({}, state, { attendees: action.payload });

    case GET_EVENT_ATTENDENCE:
      return Object.assign({}, state, {
        attendee: state.attendees.attendersList.edges.filter(
          item => item.node.id === action.payload.id
        ),
      });

    case SIGN_OUT:
      return Object.assign({}, state, {
        attendees: initialState.attendees,
        attendee: initialState.attendee,
      });

    default:
      return state;
  }
};

export const eventsSearchList = (state = initialState.eventsSearchList, action) => {
  switch (action.type) {
    case SEARCH_EVENTS:
      return [...action.payload];

    default:
      return state;
  }
};
