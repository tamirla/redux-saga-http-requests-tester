import {
  createStore, applyMiddleware, compose, combineReducers,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import app from './reducers';
import * as actions from './actions';
import { middleware, rootSaga } from './saga';

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const composeWithDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = (composeWithDevTools && composeWithDevTools({})) || compose;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userCredentials'],
  blacklist: ['userCredentials'], // redux-persist's issue, see https://github.com/rt2zz/redux-persist/issues/824
};

export default function configureStore(apiReducers) {
  const reducer = combineReducers({
    app, ...apiReducers,
  });
  const persistedReducer = persistReducer(persistConfig, reducer);
  const enhancer = composeEnhancers(applyMiddleware(middleware));
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store, null, () => store.dispatch(actions.init()));
  middleware.run(rootSaga);
  return { store, persistor };
}
