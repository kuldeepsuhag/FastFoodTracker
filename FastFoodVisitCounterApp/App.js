import React from 'react';
import Home from './components/Home';
import { NativeRouter } from 'react-router-native'

export default class App extends React.Component {

  render() {
    return (
        <NativeRouter>
          <Home />
        </NativeRouter>
        );
      }
    }