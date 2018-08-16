// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import LoadComponent from './utils/LoadComponent';

const Dashboard = LoadComponent(import('./pages/Dashboard'));
const Login = LoadComponent(import('./pages/Login/LoginPage'));
const NotFound = LoadComponent(import('./components/common/NotFound'));

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
