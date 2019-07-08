import SLACK_CHANNELS_LIST_GQL from '../../Graphql/Queries/SlackChannelsListGQL';

import { CHANNELS } from '../constants';

import { handleError } from '../../utils/errorHandler';
import Client from '../../client';

/**
 * Action creator to get list of all slack channels
 *
 * @returns {Object}
 */
export const getSlackChannelsList = () => dispatch => Client.query(
  SLACK_CHANNELS_LIST_GQL()
).then(data => dispatch({
  type: CHANNELS,
  payload: data.data,
  error: false
}))
  .catch(error => handleError(error, dispatch));
