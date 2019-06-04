import React from 'react';
import Map from './map/Map';
import ViewProfile from './views/Profile';
import Settings from './views/Settings';
import Signup from './session/Signup';
import SignIn from './session/SignIn';
import Profile from "./session/Profile";
import AppFooter from "./footer/AppFooter"
import { View, StyleSheet, AppState, AsyncStorage } from 'react-native';
import { Route, Switch } from 'react-router-native'
import Start from './session/start'
import { Location, TaskManager } from 'expo';
import axios from "axios";
import ip from "../config.js";
import { connect } from 'react-redux'


class Home extends React.Component {
    async componentDidMount() {
        await Location.startLocationUpdatesAsync('firstTask', {
          accuracy: Location.Accuracy.BestForNavigation,
        });
      }

    render() {
        return (
                <View style={{flex: 1}}>
                    <Switch>
                        <Route exact path="/" component={Start}/>
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/map" component={Map} />
                        <Route exact path="/viewProfile" component={ViewProfile} />
                        <Route exact path="/settings" component={Settings} />
                        <Route exact path="/signup" component={Signup} />
                    </Switch>
                </View>
        );
    }
}

async function checkUser(locations){
    console.log("Test")
    const isLoggedIn =   await AsyncStorage.getItem('@loggedIn')
    console.log(isLoggedIn)
    if(AppState.currentState === 'background' && isLoggedIn != null){
        console.log("BACKGROUND")
        var url =  ip.ip.address;
        console.log(locations[0].coords.latitude)
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
      console.log("locations", locations)
      console.log(AppState.currentState)
      checkUser(locations);
      // do something with the locations captured in the background
    }
  });

export default Home; 