import CATEGORY_LIST_GQL from '../../Graphql/Queries/CategoryListGQL';
import JOINED_CLUBS_GQL from '../../Graphql/Queries/JoinedClubsGQL';
import JOIN_SOCIAL_CLUB_GQL from '../../Graphql/Mutations/JoinSocialClubGQL';
import UNJOIN_SOCIAL_CLUB_GQL from '../../Graphql/Mutations/UnJoinSocialClubGQL';

import { GET_CLUBS, GET_CLUB, JOIN_CLUB, JOINED_CLUBS, UNJOIN_CLUB } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';

/**
 * Action to get all social clubs
 *
 * @param {Array} socialClubs
 *
 * @returns {Object}
 */
export const getClubs = socialClubs => ({
  type: GET_CLUBS,
  payload: socialClubs,
  error: false,
});


/**
 * Action creator to get the list of categories
 *
 * @param {Object}
 *
 * @returns {function}
 */
export const getCategoryList = ({
  before = '', after = '', first = 1, last = 1, name = '', name_Icontains = '', name_Istartswith = '', description_Icontains = '', description_Istartswith = ''
}) => dispatch => Client.query(
  CATEGORY_LIST_GQL(
    before,
    after,
    first,
    last,
    name,
    name_Icontains,
    name_Istartswith,
    description_Icontains,
    description_Istartswith
  )
).then(data => dispatch(getClubs(data.data.categoryList.edges)))
  .catch(error => handleError(error, dispatch));

/**
 * Action to get a category based on its id
 *
 * @param {String} id
 *
 * @returns {Object}
 */
export const getCategory = id => ({
  type: GET_CLUB,
  payload: { id },
  error: false,
});

/**
 * Action creator to get the joined clubs
 *
 * @returns {Object}
 */
export const joinedClubsGQL = () => dispatch => Client.query(
  JOINED_CLUBS_GQL()
).then(data => dispatch({
  type: JOINED_CLUBS,
  payload: data.data,
  error: false,
})).catch(error => handleError(error, dispatch));

/**
 * Action creator to make a user join a social club
 *
 * @param {String} clubId
 * @param {String} clientMutationId
 *
 * @returns {Object}
 */
export const joinSocialClub = (clubId, clientMutationId = '') => dispatch => Client.mutate(
  JOIN_SOCIAL_CLUB_GQL(clubId, clientMutationId)
).then(data => dispatch({
  type: JOIN_CLUB,
  payload: data.data,
  error: false,
})).catch(error => handleError(error, dispatch));

/**
 * Action creator to make a user un-join a social club
 *
 * @param {String} clubId
 * @param {String} clientMutationId
 *
 * @returns {Object}
 */
export const unjoinSocialClub = (clubId, clientMutationId = '') => dispatch => Client.mutate(
  UNJOIN_SOCIAL_CLUB_GQL(clubId, clientMutationId)
).then(data => dispatch({
  type: UNJOIN_CLUB,
  payload: data.data,
  error: false,
})).catch(error => handleError(error, dispatch));
