import React from 'react';
import Home from './components/Home';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './redux/reducers/index';

export default class App extends React.Component {

  render() {
    const store = createStore(reducers, {});
    return (
      <Provider store={store}>
        <NativeRouter>
          <Home />
        </NativeRouter>
        </Provider>
        );
      }
    }