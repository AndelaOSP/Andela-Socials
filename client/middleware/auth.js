import axios from 'axios';

import { SIGN_IN, SIGN_IN_SUCCESS, SIGN_OUT } from '../actions/constants';


const saveTokenMiddleware = ({ getState, dispatch }) => next => action => {
  if (action.type === SIGN_IN) {
    const token = action.payload.data.token;
    axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
    const jwtToSave = JSON.stringify({
      jwt: token
    });
    localStorage.setItem('a_socials', jwtToSave);
    let nextAction = {
      type: SIGN_IN_SUCCESS,
      payload: action.payload.data.user,
    };
    dispatch(nextAction);
  } else if (action.type === SIGN_OUT){
    localStorage.removeItem('a_socials');
    delete axios.defaults.headers.common['Authorization'];
  }

  next(action);
};

export default saveTokenMiddleware;
