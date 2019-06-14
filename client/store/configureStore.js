import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import rootReducer from '../reducers/index';
import saveTokenMiddleware from '../middleware/auth';

// blacklist ui state so they're not persisted
<<<<<<< HEAD
<<<<<<< HEAD
const config = {
  key: 'root', storage, blacklist: ['uiReducers', ],
};
=======
const config = { key: 'root', storage, blacklist: ['uiReducers'] };
>>>>>>> fix(sidebar): prevent sidenav hiding behind nav (#218)
=======
const config = {
  key: 'root', storage, blacklist: ['uiReducers', 'events'],
};
>>>>>>> #166502105 Display loader while events are still loading (#223)
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
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
  );
  const persistor = persistStore(store);

  return {
    persistor, store,
  };
};

export default configureStore;
