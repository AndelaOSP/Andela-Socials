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
<<<<<<< HEAD
<<<<<<< HEAD
  slackChannels,
  uiReducers,
  slackToken,
<<<<<<< HEAD
=======
  slackChannels
>>>>>>> ft(share-event-165718129) User should be able to share event to specified Slack channel (#182) (#195)
=======
  slackChannels,
  uiReducers,
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
=======
>>>>>>> feat(slack-modal): implement slack token callback (#217)
};

export default rootReducer;
