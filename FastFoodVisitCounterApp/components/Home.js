import React from 'react';
import Map from './map/Map';
import ViewProfile from './views/Profile';
import Settings from './views/Settings';
import Signup from './session/Signup';
import SignIn from './session/SignIn';
import Profile from "./session/Profile";
import AppFooter from "./footer/AppFooter"
import { View} from 'react-native';
import { Route, Switch } from 'react-router-native'
import Start from './session/start'



class Home extends React.Component {

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

export default Home; 