// react lib imports
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// components
import App from './components/App';
import Protected from './components/common/Protected';
import LoadComponent from './utils/LoadComponent'


const Login = LoadComponent(import('./pages/Login'))
const HomePage = LoadComponent(import('./pages/HomePage'))
const NotFound = LoadComponent(import('./components/common/NotFound'))


/**
 * Andela Socials Route
 */
const Routes = () => (
  <Switch>
    <App>
      <Route exact path="/login" component={Login} />
      <Route path="/home" component={HomePage} />
      <Route component={NotFound} />
    </App>
  </Switch>
);

export default Routes;
