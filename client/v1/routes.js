// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import LoadComponent from './utils/loadComponent';

/**
 * This is a component for testing redux actions and should be deleted
 * after tests have been added
 */
import TestActions from './components/TestActions/TestActions';

const Login = LoadComponent(import('./pages/Login'));
const NotFound = LoadComponent(import('./components/common/NotFound'));
const Dashboard = LoadComponent(import('./pages/Dashboard'));

/**
 * Andela Socials Route
 */
const Routes = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/TestActions" component={TestActions} />
    <Route path="/" component={Dashboard} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default Routes;
