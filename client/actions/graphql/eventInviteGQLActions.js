import { VALIDATE_EVENT_INVITE_GQL } from '../../Graphql/Mutations/ValidateEventInviteGQL';
import { VALIDATE_INVITE } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';


export const validateEventInvite = hashString => dispatch => Client.mutate(
  VALIDATE_EVENT_INVITE_GQL(hashString)
).then(data => dispatch({
  type: VALIDATE_INVITE,
  payload: data.data,
  error: false,
}))
  .catch(error => handleError(error, dispatch));

export default validateEventInvite;
