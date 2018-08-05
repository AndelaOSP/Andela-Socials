// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import App from './components/App';
import Login from './pages/Login';
import Protected from './components/common/Protected';
import NotFound from './components/common/NotFound';


/**
 * Andela Socials Route
 */
const Routes = () => (
  <Switch>
    <App>
      <Route exact path="/login" component={Login} />

      <Route component={NotFound} />
    </App>
  </Switch>
);

export default Routes;
