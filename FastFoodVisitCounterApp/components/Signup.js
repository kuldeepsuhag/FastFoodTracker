import React from 'react';
import { Button } from 'react-native-elements';
// import { Input, Text } from 'react-native-elements';
// import { Card } from 'react-native-elements';
import { Container, Header, Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet } from 'react-native';
import axios from "axios";
import ip from "../config";

export default class Signup extends React.Component {
    constructor(props, { }) {
        super(props);
        this.signupUser = this.signupUser.bind(this);
        this.state = {
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: ""
        };
      }

    componentWillMount(){
        var url = ip.ip.address;
        axios({
            method: 'post',
            url: url+"/signup",
            data: {
                id: "akshay",
                password: "akshay"
            }
          }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
           console.log(error);
        });
    }

    signupUser(){
        console.log("Pressed btn");
        this.props.history.push("/map");
    }

    render() {
      //  console.log(this.state.email);
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <CardItem header bordered>
                        <Text>Sign Up</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Item floatingLabel style={styles.input}>
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                    onChangeText={(email) => this.setState({ email })}/>
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Confirm Email</Label>
                                <Input value={this.state.confirmEmail}
                                    onChangeText={(confirmEmail) => this.setState({ confirmEmail })}/>
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Password</Label>
                                <Input value={this.state.password}
                                    onChangeText={(password) => this.setState({ password })}/>
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Confirm Password</Label>
                                <Input value={this.state.confirmPassword}
                                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}/>
                            </Item>
                        </Content>
                    </CardItem>
                    <CardItem bordered style={styles.card}>
                        <Button title="Submit" onPress={this.signupUser}/>
                    </CardItem>
                </Card>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // paddingTop: 40,
        backgroundColor: '#3066c9',
        height: '100%'
    },
    wrapper: {
        alignItems: 'center', paddingBottom: 40, paddingTop: 40
    },
    card:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
    },
    input:{
        marginBottom: '2%'
    }
});