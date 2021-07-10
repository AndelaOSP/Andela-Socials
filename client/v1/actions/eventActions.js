
import apiCall from '../utils/api';
import { GET_EVENT, ATTEND_EVENT, CREATE_EVENT, SUBSCRIBED_EVENTS, UNATTEND_EVENT, CHANGE_START_DATE } from './constants';
import { handleError } from '../utils/errorHandler';


/**
 * Action creator to get an event
 *
 * @param {String} eventId
 *
 * @returns {Object}
 */
export const getEvent = eventId => dispatch => apiCall(
  `/api/v1/event/${eventId}`, 'get'
)
  .then((res) => {
    dispatch({
      type: GET_EVENT,
      payload: res.data,
      error: false,
    });
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to join an event
 *
 * @param {String} details
 *
 * @returns {Object}
 */
export const joinEvent = details => dispatch => apiCall(
  '/api/v1/attend', 'post', details
)
  .then((res) => {
    dispatch({
      type: ATTEND_EVENT,
      payload: res.data,
      error: false,
    });
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to create an event
 *
 * @param {Object} eventData
 *
 * @returns {Object}
 */
export const createEvent = eventData => dispatch => apiCall('/api/v1/create/event', 'post', eventData)
  .then((res) => {
    dispatch({
      payload: res.data,
      type: CREATE_EVENT,
      error: false,
    });
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to get subscribed events
 *
 * @returns {Object}
 */
export const getSubscribedEvents = () => dispatch => apiCall('/api/v1/subscribed', 'get')
  .then((res) => {
    dispatch({
      type: SUBSCRIBED_EVENTS,
      payload: res.data,
      error: false,
    });
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to unsubscribe from an events
 *
 * @param {Object} event
 *
 * @returns {Object}
 */
export const unsubscribeEvent = event => dispatch => apiCall('/api/v1/unsubscribe', 'post', event)
  .then((res) => {
    dispatch({
      error: false,
      payload: res.data,
      type: UNATTEND_EVENT,
    });
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to change the start date of an event
 *
 * @param {String} startDate
 *
 * @returns {Object}
 */
export const changeStartDate = startDate => dispatch => dispatch(
  {
    type: CHANGE_START_DATE, payload: startDate,
  }
);
