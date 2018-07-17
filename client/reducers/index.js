import {
  joinedClubs,
  socialClub,
  socialClubs,
} from './socialClubReducers';
import { event, subscribedEvents } from './eventReducers';
import access from './accessReducers';
import url from './urlReducers';

const rootReducer = {
  access,
  event,
  joinedClubs,
  socialClubs,
  socialClub,
  subscribedEvents,
  url,
};

export default rootReducer;
