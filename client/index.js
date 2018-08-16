import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ApolloProvider } from 'react-apollo';
import axios from 'axios';

import configureStore from './store/configureStore';
import Routes from './routes';
import Client from './client';

import { signOut } from './actions/userActions';

import isLoggedIn from './utils/isLoggedIn';
import isTokenExpired from './utils/isTokenExpired';

// styles
import './assets/style.scss';

// store
const {
  persistor,
  store,
} = configureStore();
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common.Authorization = `JWT ${token}`;

  if (!isLoggedIn && isTokenExpired) {
    store.dispatch(signOut());
  }
}

ReactDOM.render(
  <ApolloProvider client={Client}>
    <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Routes />
          </Router>
        </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
);
