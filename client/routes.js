// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import App from './components/App';
import Login from './pages/Login';
import HomePage from './components/HomePage/HomePage';
import EventPage from './components/Events/index';
import SocialClubPage from './components/SocialClub/SocialClubPage';
import EnsureLoggedIn from './components/common/EnsureLoggedIn';
import NotFound from './components/common/NotFound';


const Routes = () => (
  <Switch>
      <Route exact path="/login" component={Login} />
      <App>
        <Route component={EnsureLoggedIn}>
          <Route path="/home" component={HomePage} />
          <Route path="/clubs/:id" component={SocialClubPage} />
          <Route path="/clubs/:club_id/events/:id" component={EventPage} />
        </Route>
      </App>
      <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
