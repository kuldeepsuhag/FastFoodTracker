import React from 'react';
import Home from './components/Home';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { View,  AppState, AsyncStorage  } from 'react-native';
import reducers from './redux/reducers/index';
import { Location, TaskManager } from 'expo';
import axios from "axios";
import ip from "./config.js";
import { connect } from 'react-redux'

export default class App extends React.Component {

  async componentDidMount() {
    await Location.startLocationUpdatesAsync('firstTask', {
      accuracy: Location.Accuracy.BestForNavigation
    });
  }

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

  async function checkUser(locations){
    // console.log("Test")
    const isLoggedIn =   await AsyncStorage.getItem('@loggedIn')
    // console.log(isLoggedIn)
    if(AppState.currentState === 'background' && isLoggedIn != null){
        // console.log("BACKGROUND")
        var url =  ip.ip.address;
        // console.log(locations[0].coords.latitude)
        axios({
          method: 'post',
          url: url + "/map-data",
          data: {
            latitude: locations[0].coords.latitude,
            longitude: locations[0].coords.longitude
            // place: city
          }
        }).then((response) => {
          console.log(response)
        });
      }
}
  
  TaskManager.defineTask('firstTask', ({ data, error }) => {
      if (error) {
        console.log(error.message)
      }
      if (data) {
        const { locations } = data;
        // console.log("locations", locations)
        // console.log(AppState.currentState)
        checkUser(locations);
        // do something with the locations captured in the background
      }
    });