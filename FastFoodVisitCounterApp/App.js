import React from 'react';
import Map from './components/Map';
import Signup from './components/Signup';
import { View } from 'react-native';



export default class App extends React.Component {

  render() {
    return (
      <View>
        <Signup />
        {/* <Map /> */}
      </View>
        );
      }
    }