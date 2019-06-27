import axios from 'axios';

import { GET_EVENT, ATTEND_EVENT, CREATE_EVENT, SUBSCRIBED_EVENTS, UNATTEND_EVENT } from './constants';
import { handleError } from '../utils/errorHandler';

import { LinkError } from 'apollo-link/lib/linkUtils';


export const getEvent = (event_id) => {
  return (dispatch) => {
    return apiCall(`/api/v1/event/${event_id}`, 'get')
      .then((res) => {
        dispatch({
          type: GET_EVENT,
          payload: res.data,
          error: false
        });
      })
      .catch(error => handleError(error, dispatch));
  };
}

export const joinEvent = (details) => {
  return (dispatch) => {
    return apiCall('/api/v1/attend', 'post', details)
      .then((res) => {
        dispatch({
          type: ATTEND_EVENT,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}

export const createEvent = (eventData) => {
  return (dispatch) => {
    return apiCall('/api/v1/create/event', 'post', eventData)
      .then((res) => {
        dispatch({
          type: CREATE_EVENT,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}

export const getSubscribedEvents = () => {
  return (dispatch) => {
    return apiCall('/api/v1/subscribed', 'get')
      .then((res) => {
        dispatch({
          type: SUBSCRIBED_EVENTS,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}

export const unsubscribeEvent = (event) => {
  return (dispatch) => {
    return apiCall('/api/v1/unsubscribe', 'post', event)
      .then((res) => {
        dispatch({
          type: UNATTEND_EVENT,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}
