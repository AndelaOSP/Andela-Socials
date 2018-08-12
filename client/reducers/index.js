import { joinedCategories, socialClubs } from './socialClubReducers';
import { events, subscribedEvents, attendees } from './eventReducers';
import interests from './interestReducers';
import url from './urlReducers';
import userReducers from './userReducers';

const rootReducer = {
  activeUser: userReducers,
  joinedCategories,
  socialClubs,
  events,
  subscribedEvents,
  attendees,
  interests,
  url,
};

export default rootReducer;
