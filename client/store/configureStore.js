import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import rootReducer from '../reducers/index';
import saveTokenMiddleware from '../middleware/auth';


const config = { key: 'root', storage };
const reducers = persistCombineReducers(config, rootReducer);
const middleware = [thunk, saveTokenMiddleware];

/**
 * Single Store
 * @param {object} initialState
 * @returns {function} store configuration
 */
const configureStore = (initialState) => {
  // eslint-disable-next-line
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
  );
  const persistor = persistStore(store);

  return { persistor, store };
};

export default configureStore;
