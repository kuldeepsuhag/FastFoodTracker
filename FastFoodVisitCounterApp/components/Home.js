import React from 'react';
import Map from '../components/Map';
import Signup from '../components/Signup';
import { View } from 'react-native';
import { Route, Switch } from 'react-router-native'

export default class Home extends React.Component {

    render() {
        return (
            <View>
                <Switch>
                    <Route exact path="/" component={Signup} />
                    <Route exact path="/map" component={Map} />
                </Switch>
            </View>
        );
    }
}