import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, CardItem, Text, Body } from 'native-base';
import AppFooter  from '../footer/AppFooter'
// import { Route, Switch } from 'react-router-native'
import StepCounter from '../step-counter/stepCounter';

export default class Profile extends React.Component {
    render() {
        return (
            <View>
                {/* <Card style={styles.card}>
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
                </Card> */}
                <Card style={styles.card}>
                    <StepCounter></StepCounter>
                </Card>
                {/* <AppFooter/> */}
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
    }
});