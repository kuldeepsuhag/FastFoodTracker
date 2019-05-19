import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Text, Body } from 'native-base';
import AppFooter  from '../footer/AppFooter'
// import { Route, Switch } from 'react-router-native'
import StepCounter from '../step-counter/stepCounter';

export default class Profile extends React.Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Text style={styles.paragraph}>
                    User Profile Data
                </Text>
                <View style={{flex: 1, backgroundColor: '#ecf0f1'}}>
                    <Card style={styles.card}>
                        {/* <StepCounter></StepCounter> */}
                    </Card>
                </View>
                <View style={{height: 50, backgroundColor: '#ecf0f1'}}>
                    < AppFooter />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profile: {
      backgroundColor: 'white',
    },
    card:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
});