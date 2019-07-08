import ATTENDERS_LIST_GQL from '../../Graphql/Queries/AttendersListGQL';
import ATTEND_EVENT_GQL from '../../Graphql/Mutations/AttendEventGQL';
import UNATTEND_EVENT_GQL from '../../Graphql/Mutations/UnAttendEventGQL';
import SUBSCRIBED_EVENTS_GQL from '../../Graphql/Queries/SubscribedEventsGQL';

import { ATTEND_EVENT, UNATTEND_EVENT, SUBSCRIBED_EVENTS, GET_ATTENDEES, GET_EVENT_ATTENDENCE } from '../constants';

import { handleError, handleInformation } from '../../utils/errorHandler';
import Client from '../../client';

/**
 * Get all the event attendees
 *
 * @param {string} before
 * @param {string} after
 * @param {number} first
 * @param {number} last
 *
 * @returns {function}
 */
export const getAllEventsAttendees = (before = '', after = '', first = 1, last = 1) => dispatch => Client.query(
  ATTENDERS_LIST_GQL(before, after, first, last)
).then(data => dispatch({
  type: GET_ATTENDEES,
  payload: data.data,
  error: false,
}))
  .catch(error => handleError(error, dispatch));

/**
 * Get a particular event attendee
 *
 * @param {number} id
 *
 * @returns {object}
 */
export const getEventAttendees = id => ({
  type: GET_EVENT_ATTENDENCE,
  payload: { id },
  error: false,
});

/**
 * Get subscribed events
 *
 * @returns {function}
 */
export const getSubscribedEvents = () => dispatch => Client.query(
  SUBSCRIBED_EVENTS_GQL()
).then(data => dispatch({
  type: SUBSCRIBED_EVENTS, payload: data.data, error: false,
}))
  .catch(error => handleError(error, dispatch));

/**
 * Action to attend an event by a user
 *
 * @param {number} eventId
 * @param {string} clientMutationId
 *
 * @returns {function}
 */
export const attendEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(
  ATTEND_EVENT_GQL(eventId, clientMutationId)
).then((data) => {
  const { attendEvent: { newAttendance } } = data.data;
  dispatch({
    type: ATTEND_EVENT,
    payload: data.data,
    error: false,
  });
  handleInformation(`'${newAttendance.status} action' was successful`);
})
  .catch(error => handleError(error, dispatch));

/**
 * Action to un-attend an event by a user
 *
 * @param {number} eventId
 * @param {string} clientMutationId
 *
 * @returns {function}
 */
export const unAttendEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(
  UNATTEND_EVENT_GQL(eventId, clientMutationId)
).then(data => dispatch({
  type: UNATTEND_EVENT, payload: data.data, error: false,
}))
  .catch(error => handleError(error, dispatch));
