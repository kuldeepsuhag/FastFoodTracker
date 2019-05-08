import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import { View, StyleSheet } from 'react-native';
import axios from "axios";
import ip from "../../config";
import ValidateForm from "../validate/ValidateForm"
import { addUser } from '../../redux/actions/index'
import {connect} from 'react-redux'
import { Link } from "react-router-native";

class Signup extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: ""
        };
        this.signinUser = this.signinUser.bind(this);
        this.validate = this.validate.bind(this);
        this.signup = this.signup.bind(this);
    }

    validate() {
        console.log(this.state.email)
        let valid = false;
        if (!(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))) {
            this.setState({ errors: "Please enter a valid email" });
            valid = true;
        }
        else if (this.state.password.length < 8) {
            this.setState({ errors: "Password should be at least of 8 characters" });
            valid = true;
        }
        return valid;
    }

    signinUser() {
        console.log("Pressed btn");
        console.log(this.state.email);
        if (!this.validate()) {
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/signin",
                data: {
                    email: this.state.email,
                    password: this.state.password
                }
            }).then((response) => {
                console.log(response.data);
                this.props.history.push("/map");
            }).catch((error) => {
                console.log(error);
            });
           // this.props.history.push("/profile");
        }
    }

    signup(){
        this.props.history.push({
            pathname: "/"
        })
    }


    render() {
        //  console.log(this.state.email);
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <CardItem header bordered>
                        <Text>Sign In</Text>
                    </CardItem>
                    <CardItem>
                        <ValidateForm errors={this.state.errors} />
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Item floatingLabel style={styles.input}>
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                    onChangeText={(email) => this.setState({email:  email })} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} value={this.state.password}
                                    onChangeText={(password) => this.setState({password: password })} />
                            </Item>
                        </Content>
                    </CardItem>
                    <CardItem bordered style={styles.card}>
                        <Button title="Submit" onPress={this.signinUser} />
                    </CardItem>
                </Card>
                <Card style={styles.card}>
                    <CardItem>
                        <Text>Go back to &nbsp;</Text>
                        <Button title="Sign Up" onPress={this.signup}>
                        </Button>
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
    card: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
    },
    input: {
        marginBottom: '2%'
    }
});

export default connect()(Signup)