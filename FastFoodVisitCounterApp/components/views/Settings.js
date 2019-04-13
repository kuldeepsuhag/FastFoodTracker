import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Text, Body } from 'native-base';
import AppFooter  from '../footer/AppFooter'
// import { Route, Switch } from 'react-router-native'

export default class Settings extends React.Component {

    render() {
        return (
            <View style= {StyleSheet.profile}>
                <Card style={styles.card}>
                    <CardItem header>
                        <Text>NativeBase</Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                //Your text here
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer>
                        <Text>GeekyAnts</Text>
                    </CardItem>
                </Card>
                <AppFooter/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
      backgroundColor: 'white',
    },
    card:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
    }
});