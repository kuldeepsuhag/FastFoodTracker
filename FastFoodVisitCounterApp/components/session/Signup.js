import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import { View, StyleSheet } from 'react-native';
import ValidateForm from "../validate/ValidateForm"
import { addUser } from '../../redux/actions/index'
import { connect } from 'react-redux'

class Signup extends React.Component {
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
        this.login = this.login.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePatientChange = this.handlePatientChange.bind(this);
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
        if (!this.validate()) {
            var data = {
                id: this.state.patient,
                email: this.state.email,
                password: this.state.password
            }
            this.props.dispatch(addUser(data));
            this.props.history.push("/profile");
        }
    }

    login() {
        this.props.history.push({
            pathname: "/"
        })
    }

    handleEmailChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ email: processedData })
    }

    handlePasswordChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ password: processedData })
    }

    handlePatientChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ patient: processedData })
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
                                    onChange={this.handlePatientChange} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                    onChange={this.handleEmailChange} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Password</Label>
                                <Input secureTextEntry={true} value={this.state.password}
                                    onChange={this.handlePasswordChange} />
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
                <Card style={styles.card}>
                    <CardItem>
                        <Text>Already have an account? &nbsp;</Text>
                        <Button title="Sign In" onPress={this.login}>

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