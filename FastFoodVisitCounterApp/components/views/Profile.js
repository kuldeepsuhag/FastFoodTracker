import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';
// import { Route, Switch } from 'react-router-native'

export default class Profile extends React.Component {

    render() {
        return (
            <View style= {StyleSheet.profile}>
                <Text>TEST PROFILE</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profile: {
      backgroundColor: 'white',
    }
});