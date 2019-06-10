import { SUBNAV_HIDDEN } from './constants';

export const hideSubNav = (payload) => {
  return (dispatch) => {
    dispatch({
      type: SUBNAV_HIDDEN,
      payload,
    });
  };
}
