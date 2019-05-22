import React from 'react';
import { View, StyleSheet, BackHandler, Image } from 'react-native';
import { Card, Text } from 'native-base';
import AppFooter from '../footer/AppFooter'
import { connect } from 'react-redux'
// import { Route, Switch } from 'react-router-native'
import StepCounter from '../step-counter/stepCounter';


class Profile extends React.Component {
    componentDidMount() {
        console.log(this.props.userDetails);
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
            <View style={{ flex: 1 }}>
                <Text style={styles.paragraph}>
                    User Profile Data
                </Text>
                {this.props.userDetails.state.image ?
                        <Image
                            style={{
                                width: 150,
                                height: 150,
                                resizeMode: 'contain',
                            }}
                            source={{
                                uri:
                                'data:text/plain;base64,' +  this.props.userDetails.state.image,
                            }}
                        /> : <Text>""</Text>}
                <View style={{ flex: 1, backgroundColor: '#ecf0f1' }}>
                    <Card style={styles.card}>
                        <Text>{this.props.userDetails.state.PatientID}</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Text>{this.props.userDetails.state.name}</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Text>{this.props.userDetails.state.Email}</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Text>{this.props.userDetails.state.height}</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Text>{this.props.userDetails.state.weight}</Text>
                    </Card>
                </View>
                <View style={{ height: 50, backgroundColor: '#ecf0f1' }}>
                    <AppFooter props={this.props} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profile: {
        backgroundColor: 'white',
    },
    card: {
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

const mapStateToProps = (state) => {
    return {
        userDetails: state
    }
}

export default connect(mapStateToProps)(Profile); 