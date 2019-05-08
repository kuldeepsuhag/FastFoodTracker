import React from 'react';
import Map from './map/Map';
import ViewProfile from './views/Profile';
import Settings from './views/Settings';
import Signup from './session/Signup';
import SignIn from './session/SignIn';
import Profile from "./session/Profile";
import { View, StyleSheet } from 'react-native';
import { Route, Switch } from 'react-router-native'

export default class Home extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Switch>
                    <Route exact path="/" component={Map} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/map" component={Map} />
                    <Route exact path="/viewProfile" component={ViewProfile} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/login" component={SignIn} />
                </Switch>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '100%'
    }
});