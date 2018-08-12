import ATTENDERS_LIST_GQL from '../../Graphql/Queries/AttendersListGQL';
import ATTEND_EVENT_GQL from '../../Graphql/Mutations/AttendEventGQL';
import UNATTEND_EVENT_GQL from '../../Graphql/Mutations/UnAttendEventGQL';
import SUBSCRIBED_EVENTS_GQL from '../../Graphql/Queries/SubscribedEventsGQL';

import { ATTEND_EVENT, UNATTEND_EVENT, SUBSCRIBED_EVENTS, GET_ATTENDEES, GET_EVENT_ATTENDENCE } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';


export const getAllEventsAttendees = (before = '', after = '', first = 1, last = 1) => dispatch => Client.query(
  ATTENDERS_LIST_GQL(before, after, first, last)
).then(data => dispatch({
  type: GET_ATTENDEES,
  payload: data.data,
  error: false,
}))
.catch(error => handleError(error, dispatch));

export const getEventAttendees = id => ({
  type:GET_EVENT_ATTENDENCE,
  payload: { id },
  error: false,
});

export const getSubscribedEvents = () => dispatch => Client.query(
  SUBSCRIBED_EVENTS_GQL()
).then(data => dispatch({ type: SUBSCRIBED_EVENTS, payload: data.data, error: false, }))
.catch(error => handleError(error, dispatch));

export const attendEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(
  ATTEND_EVENT_GQL(eventId, clientMutationId)
).then(data => dispatch({ type: ATTEND_EVENT, payload: data.data, error: false, }))
.catch(error => handleError(error, dispatch));

export const unAttendEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(
  UNATTEND_EVENT_GQL(eventId, clientMutationId)
).then(data => dispatch({ type: UNATTEND_EVENT, payload: data.data, error: false, }))
.catch(error => handleError(error, dispatch));

