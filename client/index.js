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

// styles
import './assets/style.scss';

// store
const { persistor, store } = configureStore();

if (localStorage.getItem('a_socials')) {
  const token = JSON.parse(localStorage.getItem('a_socials'));
  const { jwt } = token;
  axios.defaults.headers.common.Authorization = `JWT ${jwt}`;
}

ReactDOM.render(
  <ApolloProvider client={Client}>
    <Provider store={store}>
      <div>
        <PersistGate persistor={persistor}>
          <Router>
            <Routes />
          </Router>
        </PersistGate>
      </div>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
);
