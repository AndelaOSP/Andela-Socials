import { event, subscribedEvents } from './eventReducers';
import url from './urlReducers';
import userReducers from './userReducers';

const rootReducer = {
  activeUser: userReducers,
  event,
  subscribedEvents,
  url,
};

export default rootReducer;
