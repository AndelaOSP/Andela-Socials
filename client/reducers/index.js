import { joinedCategories, socialClubs } from './socialClubReducers';
import {
  events,
  eventReducer,
  subscribedEvents,
  attendees,
  eventsSearchList,
  uploadImage,
} from './eventReducers';
import interests from './interestReducers';
import slackChannels from './slackChannelsReducers';
import url from './urlReducers';
import userReducers from './userReducers';
import uiReducers from './uiReducers';
import { inviteValidation } from './inviteReducers';
import oauth from './oauthReducers';
import slackToken from './slackTokenReducer';

const rootReducer = {
  activeUser: userReducers,
  event: eventReducer,
  joinedCategories,
  socialClubs,
  events,
  uploadImage,
  subscribedEvents,
  eventsSearchList,
  attendees,
  interests,
  url,
  oauth,
  invite: inviteValidation,
  slackChannels,
  uiReducers,
  slackToken,
};

export default rootReducer;
