import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem, Toast } from 'native-base';
import { View, StyleSheet, ImageBackground, Image, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import ValidateForm from "../validate/ValidateForm"
import { addUser } from '../../redux/actions/index'
import { connect } from 'react-redux'
import image from '../../Images/background.jpg'
import logo from '../../Images/logo.gif'
const { width : WIDTH} = Dimensions.get('window')
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
            pathname: "/signin"
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
            <ImageBackground source = {image} style={styles.backgroundcontainer}>
            
            <View style={styles.container}>
            <View style={styles.logocontainer}>
                    <Image source={logo} style={styles.logo}/> 
                    <Text style={styles.logotext}>FAST FOOD VISIT COUNTER</Text>
                </View>
            <View>
                <Text style={styles.text}>Register</Text>
            </View>
            <View>
                 <ValidateForm errors={this.state.errors} />
            </View>
            <View>
                    <TextInput 
                         style={styles.input}
                         placeholder={'Patient ID'}
                         keyboardType="numeric"
                         placeholderTextColor={'rgb(36,133,202)'}
                         underlineColorAndroid='transparent'
                         value={this.state.patient}
                         onChange={this.handlePatientChange}
                     />
                </View>
                <View>
                    <TextInput 
                         style={styles.input}
                         placeholder={'Email'}
                         placeholderTextColor={'rgb(36,133,202)'}
                         underlineColorAndroid='transparent'
                         value={this.state.email}
                         onChange={this.handleEmailChange}
                     />
                </View>
                <View>
                    <TextInput 
                         style={styles.input}
                         placeholder={'Password'}
                         placeholderTextColor={'rgb(36,133,202)'}
                         underlineColorAndroid='transparent'
                         value={this.state.password}
                         onChange={this.handlePasswordChange}
                         secureTextEntry={true}
                     />
                </View>
                <View>
                <TouchableOpacity style = {styles.btnlogin} onPress={this.signupUser}>
                    <Text style={styles.logintext}>Next</Text>
                </TouchableOpacity>
                </View>
                <View>
                <Text onPress={this.login}>Already have an account</Text>
                        {/* <Button title="Sign Up" >
                        </Button> */}
                </View>
                
            </View >
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    backgroundcontainer:{
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // paddingTop: 40,
        // backgroundColor: '#3066c9',
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
    tb5: {
        marginBottom: '2%',
       
         borderColor: '#7a42f4',
      borderWidth: 1
       
    },
    input: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 45,
        fontSize: 16,
        paddingLeft: 45,
        // backgroundColor: 'rgb(151,214,240)',
        backgroundColor: 'rgb(255,255,255)',
        color: 'rgb(36,133,202)',
        marginHorizontal: 25,
        marginBottom: '2%'
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 130
    },
    logocontainer:{
        alignItems: 'center'
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 130
        
    },
    btnlogin: {
        width: 100,
        height: 45,
        borderRadius: 45,
        backgroundColor: "#432577",
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: '2%',
        marginLeft: 130

    },
    logintext:{
        color: "rgb(36,133,202)",
        fontSize: 16,
        textAlign: 'center'
    }
});

export default connect()(Signup)