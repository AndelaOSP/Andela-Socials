import INTERESTS_LIST_GQL from '../../Graphql/Queries/InterestsListGQL';
import CALENDAR_URL_GQL from '../../Graphql/Queries/CalendarAuthGQL';

import { INTEREST, INTERESTS } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';


export const getInterestsList = (before = '', after = '', first = 1, last = 1) => dispatch => Client.query(
  INTERESTS_LIST_GQL(before, after, first, last)
).then(data => dispatch({
  type: INTERESTS,
  payload: data.data,
  error: false
}))
.catch(error => handleError(error, dispatch));

export const getInterest = id => ({
  type: INTEREST,
  payload: { id },
  error: false
});

export const getCalendarUrl = () => dispatch => Client.query(CALENDAR_URL_GQL())
  .then(({ data }) => {
    const { authUrl }= data.calendarAuth;
    return authUrl
  })
  .catch(error => handleError(error, dispatch));

