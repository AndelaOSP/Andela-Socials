import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './store/configureStore';
import routes from './routes';
import axios from 'axios';
import { ApolloProvider } from 'react-apollo';

// styles
import './assets/style.scss';
import Client from "./client";

// store
const { persistor, store } = configureStore();

if (localStorage.getItem('a_socials')) {
  const token = JSON.parse(localStorage.getItem('a_socials'));
  const jwt = token.jwt;
  axios.defaults.headers.common['Authorization'] = `JWT ${jwt}`;
}

gapi.load('auth2', () => {
  gapi.auth2.init({
    client_id: process.env.CLIENT_ID,
    hosted_domain: process.env.G_SUITE_DOMAIN,
    ux_mode: 'popup'
  }).then(() => {
    ReactDOM.render(
      <ApolloProvider client={Client}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Router routes={routes} history={browserHistory} />
          </PersistGate>
        </Provider>
      </ApolloProvider>,
      document.getElementById("app")
    );
  });
});
