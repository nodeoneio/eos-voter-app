import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import persistConfig from './persist';

export default function configureStore(initialState) {

  // const composeEnhancers =
  // typeof window === 'object' &&
  // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  //     // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  //   }) : compose;

  // const composeEnhancers = composeWithDevTools({
  //   // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  // })
  //
  // const enhancer = composeEnhancers(
  //   applyMiddleware(thunk)
  //   // other store enhancers if any
  // )

  const enhancer = compose(
    applyMiddleware(thunk)
  );
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
