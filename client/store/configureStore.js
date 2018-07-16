import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { saveTokenMiddleware } from '../middleware/auth';


const config = {
  key: 'root',
  storage,
};
const reducers = persistCombineReducers(config, rootReducer);
const middleware = [thunk, saveTokenMiddleware];

/**
 * Single Store
 * @param {object} initialState
 * @returns {function} store configuration
 */
const configureStore = (initialState) => {
  let store = createStore(
    reducers,
    compose(
      applyMiddleware(...middleware),
      window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    )
  );
  let persistor = persistStore(store);

  return { persistor, store };
};

export default configureStore;
