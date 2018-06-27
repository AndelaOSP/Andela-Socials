import axios from 'axios';
import { GET_CLUB, GET_CLUBS, JOIN_CLUB, UNJOIN_CLUB, JOINED_CLUBS } from './constants';
import { handleError } from "../utils/errorHandler";

export const getClubs = (socialClubs) => ({
    type: GET_CLUBS,
    payload: socialClubs,
    error: false,
});

export const getAllClubs = () =>
  (dispatch) => {
    return axios.get('/api/v1/categories/')
      .then((socialClubs) => {
        dispatch(getClubs(socialClubs.data.results));
      })
      .catch(error => handleError(error, dispatch));
  };

export const getClub = (club_id) =>
  (dispatch) => {
    return axios.get(`/api/v1/category/${club_id}/events/`)
      .then((res) => {
        dispatch({
          type: GET_CLUB,
          payload: res.data,
          error: false
        });
      })
      .catch(error => handleError(error, dispatch));
  };

export const joinClub = (details) =>
  (dispatch) => {
    return axios.post('/api/v1/join/', details)
      .then((res) => {
        dispatch({
          type: JOIN_CLUB,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };

export const unjoinClub = (details) =>
  (dispatch) => {
    return axios.post('/api/v1/unjoin/', details)
      .then((res) => {
        dispatch({
          type: UNJOIN_CLUB,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };

export const joinedClubs = () =>
  (dispatch) => {
    return axios.get('/api/v1/joined/')
      .then((res) => {
        dispatch({
          type: JOINED_CLUBS,
          payload: res.data,
          error: false
        })
      })
      .catch(error => handleError(error, dispatch));
  };
