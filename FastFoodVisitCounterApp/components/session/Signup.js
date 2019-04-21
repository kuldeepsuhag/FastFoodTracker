import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import { View, StyleSheet } from 'react-native';
import axios from "axios";
import ip from "../../config";
import ValidateForm from "../validate/ValidateForm"

export default class Signup extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            email: "",
            patient: "",
            password: "",
            // confirmPassword: "",
            errors: ""
        };
        this.signupUser = this.signupUser.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate() {
        let valid = false;
        if (!(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))) {
            this.setState({ errors: "Please enter a valid email" });
            valid = true;
        }
        else if (this.state.password.length < 8) {
            this.setState({ errors: "Password should be at least of 8 characters" });
            valid = true;
        }
        // else if (this.state.password !== this.state.confirmPassword) {
        //     this.setState({ errors: "Both the passwords don't match" });
        //     valid = true;
        // }
        return valid;
    }

    signupUser() {
        console.log("Pressed btn");
        console.log(this.state.patient);
    //    this.props.history.push("/profile");
        if (!this.validate()) {
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/signup",
                data: {
                    id: this.state.patient,
                    email: this.state.email,
                    password: this.state.password
                }
            }).then((response) => {
                console.log(response.data);
                this.props.history.push("/profile");
            }).catch((error) => {
                console.log(error);
            });

        } else {

        }
    }


    render() {
        //  console.log(this.state.email);
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <CardItem header bordered>
                        <Text>Sign Up</Text>
                    </CardItem>
                    <CardItem>
                        <ValidateForm errors={this.state.errors} />
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Item floatingLabel style={styles.input}>
                                <Label>Patient ID</Label>
                                <Input value={this.state.patient}
                                    onChangeText={(patient) => this.setState({ patient })} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                    onChangeText={(email) => this.setState({ email })} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Password</Label>
                                <Input value={this.state.password}
                                    onChangeText={(password) => this.setState({ password })} />
                            </Item>
                            {/* <Item floatingLabel style={styles.input}>
                                <Label>Confirm Password</Label>
                                <Input value={this.state.confirmPassword}
                                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />
                            </Item> */}
                        </Content>
                    </CardItem>
                    <CardItem bordered style={styles.card}>
                        <Button title="Submit" onPress={this.signupUser} />
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