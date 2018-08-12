import INTERESTS_LIST_GQL from '../../Graphql/Queries/InterestsListGQL';

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


