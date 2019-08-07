import INTERESTS_LIST_GQL from '../../Graphql/Queries/InterestsListGQL';
import CALENDAR_URL_GQL from '../../Graphql/Queries/CalendarAuthGQL';
import CREATE_INTEREST_GQL from '../../Graphql/Mutations/CreateInterestGQL';
import REMOVE_INTEREST_GQL from '../../Graphql/Mutations/RemoveInterestGQL';
import JOINED_CATEGORIES_GQL from '../../Graphql/Queries/JoinedCategoriesGQL';

import { INTEREST, INTERESTS, CREATE_INTERESTS, REMOVE_INTERESTS, JOINED_CATEGORIES } from '../constants';
import { handleError, handleInformation } from '../../utils/errorHandler';
import Client from '../../client';

/**
 * Action creator to validate and event invite
 *
 * @param {String} before
 * @param {String} after
 * @param {Number} first
 * @param {Number} last
 *
 * @returns {Object}
 */
export const getInterestsList = (before = '', after = '', first = 1, last = 1) => dispatch => Client.query(
  INTERESTS_LIST_GQL()
).then((data) => {
  dispatch({
    type: INTERESTS,
    payload: data.data,
    error: false,
  });
})
  .catch(error => handleError(error, dispatch));

/**
 * Action to get an interest
 *
 * @param {String} id
 *
 * @returns {Object}
 */
export const getInterest = id => ({
  type: INTEREST,
  payload: { id },
  error: false,
});

/**
 * Action creator to get an interest
 *
 * @returns {String} authUrl
 */
export const getCalendarUrl = () => dispatch => Client.query(CALENDAR_URL_GQL())
  .then(({ data }) => {
    const { authUrl } = data.calendarAuth;
    return authUrl;
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action to get interest of users
 *
 * @returns {Object}
 */
export const getUserInterests = () => dispatch => Client.query(
  JOINED_CATEGORIES_GQL()
).then((data) => {
  dispatch({
    type: JOINED_CATEGORIES,
    payload: data.data,
    error: false,
  });
}).catch(error => handleError(error, dispatch));

/**
 * Action creator to create new user interests
 *
 * @param {String} interestsId
 * @param {String} clientMutationId
 *
 * @returns {Object}
 */
export const createInterests = (interestsId, clientMutationId = '') => dispatch => Client.mutate(
  CREATE_INTEREST_GQL(interestsId, clientMutationId)
)
  .then((data) => {
    dispatch({
      type: CREATE_INTERESTS,
      payload: data.joinedCategoryList,
      error: false,
    });
    handleInformation('Successfully Created Interests');
  })
  .catch(error => handleError(error, dispatch));

/**
 * Action creator to remove users interests
 *
 * @param {String} interestsId
 * @param {String} clientMutationId
 *
 * @returns {Object}
 */
export const removeInterests = (interestsId, clientMutationId = '') => dispatch => Client.mutate(
  REMOVE_INTEREST_GQL(interestsId, clientMutationId)
)
  .then((data) => {
    dispatch({
      payload: data.unjoinedCategories,
      type: REMOVE_INTERESTS,
      error: false,
    });
    handleInformation('Successfully Removed Interests');
  })
  .catch(error => handleError(error, dispatch));
