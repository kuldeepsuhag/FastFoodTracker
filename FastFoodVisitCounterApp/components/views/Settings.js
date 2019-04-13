import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';
// import { Route, Switch } from 'react-router-native'

export default class Settings extends React.Component {

    render() {
        return (
            <View style= {StyleSheet.profile}>
                <Text>TEST settings</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
      backgroundColor: 'white',
    }
});