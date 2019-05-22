import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Card, CardItem, Text, Body } from 'native-base';
import AppFooter  from '../footer/AppFooter'
// import { Route, Switch } from 'react-router-native'
import StepCounter from '../step-counter/stepCounter';
export default class Settings extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <Text style={styles.paragraph}>
                    User Daily Steps
                </Text>
                <View style={{flex: 1, backgroundColor: '#ecf0f1'}}>
                    <View>
                        <StepCounter></StepCounter>
                    </View>
                </View>
                <View style={{height: 50, backgroundColor: '#ecf0f1'}}>
                    < AppFooter props={this.props}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
      backgroundColor: 'white',
    },
    card:{
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
});