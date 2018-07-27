// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './components/common/NotFound';


/**
 * Andela Socials Route
 */
const Routes = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route path="/" component={Dashboard} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
