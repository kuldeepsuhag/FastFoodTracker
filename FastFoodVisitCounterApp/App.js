import React from 'react';
import Home from './components/Home';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { View  } from 'react-native';
import reducers from './redux/reducers/index';

export default class App extends React.Component {

  render() {
    const store = createStore(reducers, {});
    return (
      <Provider store={store}>
        <NativeRouter>
        <View style = {{flex: 1}} >
          <Home />
          </View>
        </NativeRouter>
        </Provider>
        );
      }
    }