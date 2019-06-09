import React from 'react';
import Home from './components/Home';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { View } from 'react-native';
import reducers from './redux/reducers/index';
import axios from "axios";

export default class App extends React.Component {

  componentDidMount() {
    axios.defaults.baseURL = 'http://10.12.177.71:5000';
  }
  
  render() {
    const store = createStore(reducers, {});
    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={{ flex: 1 }} >
            <Home />
          </View>
        </NativeRouter>
      </Provider>
    );
  }
}