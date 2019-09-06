import { SUBNAV_HIDDEN } from './constants';

/**
 * Callback action
 *
 * @param {Object} payload
 * @return {{type: (object}}
 */
// eslint-disable-next-line import/prefer-default-export
export const hideSubNav = payload => (dispatch) => {
  dispatch({
    type: SUBNAV_HIDDEN,
    payload,
  });
};
