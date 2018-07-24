import { AppRegistry } from 'react-native'
import Root from './Root'
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store' //Import the store
import { PersistGate } from 'redux-persist/integration/react'
import TestView from './containers/TestView'

const { store, persistor } = configureStore()


console.log(process.env.NODE_ENV, 'node env')
if (process.env.NODE_ENV == 'development') {
  const unsubscribe = store.subscribe(() =>
    console.log(store.getState(), 'State Subscribe')
  )
} else {
  console.log = ()=>{}
  console.warn = ()=>{}
}
console.disableYellowBox = true
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed']

class App extends Component {
    render() {
        return (
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Root />
                {/* <TestView/> */}
              </PersistGate>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('eosvoterapp', () => App)
