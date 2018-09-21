import { joinedCategories, socialClubs } from './socialClubReducers';
import {
  events,
  eventReducer,
  subscribedEvents,
  attendees,
  eventsSearchList,
} from './eventReducers';
import interests from './interestReducers';
import url from './urlReducers';
import userReducers from './userReducers';
import oauth from './oauthReducers';

const rootReducer = {
  activeUser: userReducers,
  event: eventReducer,
  joinedCategories,
  socialClubs,
  events,
  subscribedEvents,
  eventsSearchList,
  attendees,
  interests,
  url,
  oauth,
};

export default rootReducer;
