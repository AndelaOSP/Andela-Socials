import EVENT_LIST_GQL from '../../Graphql/Queries/EventListGQL';
// import EVENT_GQL from '../../Graphql/Queries/EventGQL';
import CREATE_EVENT_GQL from '../../Graphql/Mutations/CreateEventGQL';
import UPDATE_EVENT_GQL from '../../Graphql/Mutations/UpdateEventGQL';
import DEACTIVATE_EVENT_GQL from '../../Graphql/Mutations/DeactivateEventGQL';

import { GET_EVENT, CREATE_EVENT, GET_EVENTS, UPDATE_EVENT, DEACTIVATE_EVENT } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';


export const getEventsList = ({
  after = '',
  first = 9,
  startDate,
  venue,
  category,
}) => dispatch => Client.query(
  EVENT_LIST_GQL(after, first, startDate, venue, category)
).then(data => dispatch({
  type: GET_EVENTS,
  payload: data.data.eventsList.edges,
  error: false,
}))
  .catch(error => handleError(error, dispatch));

/**
 * This commented out code below has a use case
 * where one can not access events that they have deactivated,
 * You would use this to view them, not sure how it fits in with where one would need
 * to get the id of the event
 */

// export const getEvent = id => dispatch => Client.query(
//   EVENT_GQL(id)
// ).then(data => dispatch({type: GET_EVENT, payload: data, error: false,}))
// .catch(error => handleError(error, dispatch));

export const getEvent = id => ({
  type: GET_EVENT,
  payload: { id },
  error: false,
});

export const createEvent = (
  title,
  description,
  featuredImage,
  venue,
  date,
  time,
  socialEventId
) => dispatch => Client.mutate(
  CREATE_EVENT_GQL(
    title,
    description,
    featuredImage,
    venue,
    date,
    time,
    socialEventId
  )
).then(data => dispatch({
  type: CREATE_EVENT, payload: data.data, error: false,
}))
  .catch(error => handleError(error, dispatch));

export const updateEvent = (
  eventId,
  title,
  description,
  featuredImage,
  venue,
  date,
  time,
  socialEventId
) => dispatch => Client.mutate(
  UPDATE_EVENT_GQL(
    eventId,
    title,
    description,
    featuredImage,
    venue,
    date,
    time,
    socialEventId
  )
).then(data => dispatch({
  type: UPDATE_EVENT, payload: data.data, error: false,
}))
  .catch(error => handleError(error, dispatch));

export const deactivateEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(
  DEACTIVATE_EVENT_GQL(eventId, clientMutationId)
).then(data => dispatch({
  type: DEACTIVATE_EVENT, payload: { id: eventId },
}))
  .catch(error => console.log(`received error ${error}`));
