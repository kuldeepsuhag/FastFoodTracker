import React from 'react';
import { Button } from 'react-native-elements';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet } from 'react-native';
import axios from "axios";
import ip from "../config";

export default class Signup extends React.Component {
    state = {
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
    };

    componentWillMount(){
        var url = ip.ip.address;
        axios.get(url+"/test", {
            params: {
                id: "akshay"
            }
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
           console.log(error);
        });
    }

    render() {
      //  console.log(this.state.email);
        return (
            <View style={styles.container}>
                <Text h3
                    style={{ textAlign: 'center', color: '#fff' }}

                >Register</Text>
                <View style={styles.wrapper}>
                    <Input
                        style={styles.inputStyle}
                        placeholder=' Email'
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        leftIcon={
                            <Icon
                                name='envelope-square'
                                size={24}
                                color='white'
                            />

                        }

                    />
                    <Input
                        style={styles.inputStyle}
                        placeholder='Confirm Email'
                        value={this.state.confirmEmail}
                        onChangeText={(confirmEmail) => this.setState({ confirmEmail })}
                        leftIcon={
                            <Icon
                                name='envelope-square'
                                size={24}
                                color='white'
                            />
                        }
                    />
                    <Input
                        style={styles.inputStyle}
                        placeholder='Password'
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='white'
                            />
                        }
                    />
                    <Input
                        style={styles.inputStyle}
                        placeholder='Confirm Password'
                        value={this.state.confirmPassword}
                        onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='white'
                            />
                        }
                    />
                </View>
                <Button
                    title="Submit"
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingTop: 40,
        backgroundColor: '#3066c9',
    },
    wrapper: {
        alignItems: 'center', paddingBottom: 40, paddingTop: 40
    }
});