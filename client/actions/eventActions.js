import axios from 'axios';
import {GET_EVENT, JOIN_EVENT, CREATE_EVENT, SUBSCRIBED_EVENTS, UNSUBSCRIBE_EVENT} from './constants';
import { handleError } from "../utils/errorHandler";

export const getEvent = (event_id) => {
  return (dispatch) => {
    return axios.get(`/api/v1/event/${event_id}`)
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
    return axios.post('/api/v1/attend', details)
      .then((res) => {
        dispatch({
          type: JOIN_EVENT,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}

export const createEvent = (eventData) => {
  return (dispatch) => {
    return axios.post('/api/v1/create/event', eventData)
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
    return axios.get('/api/v1/subscribed')
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
    return axios.post('/api/v1/unsubscribe', event)
      .then((res) => {
        dispatch({
          type: UNSUBSCRIBE_EVENT,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
}
