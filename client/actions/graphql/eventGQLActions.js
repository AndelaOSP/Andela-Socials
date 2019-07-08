import EVENT_LIST_GQL from '../../Graphql/Queries/EventListGQL';
import EVENT_GQL from '../../Graphql/Queries/EventGQL';
import CREATE_EVENT_GQL from '../../Graphql/Mutations/CreateEventGQL';
import UPDATE_EVENT_GQL from '../../Graphql/Mutations/UpdateEventGQL';
import SHARE_EVENT_GQL from '../../Graphql/Mutations/ShareEventGQL';
import DEACTIVATE_EVENT_GQL from '../../Graphql/Mutations/DeactivateEventGQL';

import {
  GET_EVENT,
  CREATE_EVENT,
  GET_EVENTS,
  GET_EVENTS_LOADING,
  UPDATE_EVENT,
  LOAD_MORE_EVENTS,
  DEACTIVATE_EVENT,
  SEARCH_EVENTS,
  SHARE_EVENT,
  SLACK_TOKEN,
} from '../constants';

import { handleError, handleInformation } from '../../utils/errorHandler';
import Client from '../../client';

export const getEventsList = ({
  after = '',
  first = 9,
  title,
  startDate,
  venue,
  category,
}) => (dispatch) => {
  dispatch({
    type: GET_EVENTS_LOADING,
    payload: true,
  });
  Client.query(EVENT_LIST_GQL(after, first, title, startDate, venue, category))
  .then((data) => {
    const { eventsList } = data.data;
    eventsList.requestedStartDate = startDate;
    dispatch({
      type: after ? LOAD_MORE_EVENTS : GET_EVENTS,
      payload: eventsList,
      error: false,
    })
  })
  .catch(error => handleError(error, dispatch))
  .finally(dispatch({
    type: GET_EVENTS_LOADING,
    payload: false,
  }));
};

/**
 * This commented out code below has a use case
 * where one can not access events that they have deactivated,
 * You would use this to view them, not sure how it fits in with where one would need
 * to get the id of the event
 */

export const getEvent = id => dispatch => Client.query(EVENT_GQL(id))
  .then(data => dispatch({
    type: GET_EVENT,
    payload: data,
    error: false,
  }))
  .catch(error => handleError(error, dispatch));

export const createEvent = ({
  title,
  description,
  featuredImage,
  venue,
  startDate,
  endDate,
  timezone,
  categoryId,
  slackChannel
}) => dispatch => Client.mutate(
  CREATE_EVENT_GQL(
    title,
    description,
    featuredImage,
    venue,
    startDate,
    endDate,
    timezone,
    categoryId,
    slackChannel
  )
).then((data) => {
  dispatch({
    type: SLACK_TOKEN, payload: data.data.createEvent,
  });
  dispatch({
    type: CREATE_EVENT, payload: data.data, error: false,
  });
})
  .catch((error) => {
    if (error.toString().includes('Calendar API not authorized')) {
      const authUrl = error.graphQLErrors[0].AuthUrl;
      window.location.href = authUrl;
    } else {
      handleError(error, dispatch);
    }
  });

export const updateEvent = ({
  eventId,
  title,
  description,
  featuredImage,
  venue,
  startDate,
  endDate,
  timezone,
  categoryId,
  slackChannel
}) => dispatch => Client.mutate(
  UPDATE_EVENT_GQL(eventId, title, description, featuredImage, venue, startDate, endDate, timezone, categoryId, slackChannel)
)
  .then((data) => {
    handleInformation(data.data.updateEvent.actionMessage);
    dispatch({
      type: UPDATE_EVENT,
      payload: data.data,
      error: false,
    });
  })
  .catch(error => handleError(error, dispatch));

export const deactivateEvent = (eventId, clientMutationId = '') => dispatch => Client.mutate(DEACTIVATE_EVENT_GQL(eventId, clientMutationId))
  .then((data) => {
    handleInformation(data.data.deactivateEvent.actionMessage);
    dispatch({
      type: DEACTIVATE_EVENT,
      payload: { id: eventId },
    });
  })
  .catch(error => handleError(error, dispatch));

export const searchEvents = ({
  after = '', first = 9, title,
}) => dispatch => Client.query(EVENT_LIST_GQL(after, first, title))
  .then(data => dispatch({
    type: SEARCH_EVENTS,
    payload: data.data.eventsList.edges,
    error: false,
  }))
  .catch(error => handleError(error, dispatch));

export const shareEvent = ({
  eventId,
  channelId,
}) => dispatch => Client.mutate(
  SHARE_EVENT_GQL(eventId, channelId)
).then((data) => {
  handleInformation('Successfully shared');
  dispatch({
    type: SHARE_EVENT, payload: data.data, error: false,
  });
})
  .catch(error => handleError(error, dispatch));
