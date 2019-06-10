import INTERESTS_LIST_GQL from '../../Graphql/Queries/InterestsListGQL';
import CALENDAR_URL_GQL from '../../Graphql/Queries/CalendarAuthGQL';
import CREATE_INTEREST_GQL from '../../Graphql/Mutations/CreateInterestGQL';
import REMOVE_INTEREST_GQL from '../../Graphql/Mutations/RemoveInterestGQL';
import JOINED_CATEGORIES_GQL from '../../Graphql/Queries/JoinedCategoriesGQL';

import { INTEREST, INTERESTS, CREATE_INTERESTS, REMOVE_INTERESTS, JOINED_CATEGORIES } from '../constants';
import { handleError, handleInformation } from '../../utils/errorHandler';
import Client from '../../client';


export const getInterestsList = (before = '', after = '', first = 1, last = 1) => dispatch => Client.query(
  INTERESTS_LIST_GQL()
).then(data => {
  dispatch({
    type: INTERESTS,
    payload: data.data,
    error: false
  }
  )
})
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
export const getUserInterests = () => dispatch => Client.query(
  JOINED_CATEGORIES_GQL()
).then(data => {
  dispatch({
    type: JOINED_CATEGORIES,
    payload: data.data,
    error: false,
  })
}).catch(error => handleError(error, dispatch));


export const createInterests = (interestsId, clientMutationId = '') => dispatch => Client.mutate(CREATE_INTEREST_GQL(interestsId, clientMutationId))
  .then((data) => {
    dispatch({
      type: CREATE_INTERESTS,
      payload: data.joinedCategoryList,
      error: false,
    });
    handleInformation('Successfully Created Interests');
  })
  .catch(error => handleError(error, dispatch));


export const removeInterests = (interestsId, clientMutationId = '') => dispatch => Client.mutate(REMOVE_INTEREST_GQL(interestsId, clientMutationId))
  .then((data) => {
    dispatch({
      type: REMOVE_INTERESTS,
      payload: data.unjoinedCategories,
      error: false,
    });
    handleInformation('Successfully Removed Interests');

  })
  .catch(error => handleError(error, dispatch));
