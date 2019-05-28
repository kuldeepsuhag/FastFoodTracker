import React from 'react';
import { Text} from 'native-base';
import { View, StyleSheet,AsyncStorage, ImageBackground, Image, Dimensions, 
    TextInput, TouchableOpacity, BackHandler, KeyboardAvoidingView, Keyboard } from 'react-native';
import axios from "axios";
import ip from "../../config";
import ValidateForm from "../validate/ValidateForm"
import { userData } from '../../redux/actions/index'
import { connect } from 'react-redux'
import image from '../../Images/background.jpg' 
import logo from '../../Images/logo.gif'
const { width : WIDTH} = Dimensions.get('window')
import Toast, { DURATION } from 'react-native-easy-toast'
class SignIn extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: "",
            // base64: null
        };
        this.signinUser = this.signinUser.bind(this);
        this.validate = this.validate.bind(this);
        this.signup = this.signup.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    componentWillMount = async () => {
        AsyncStorage.clear();
        try {
            const username = await AsyncStorage.getItem('@username')
            const password = await AsyncStorage.getItem('@password')
            if (username !== null && password !== null) {
                this.signinUser(true, username, password);
            }
        } catch (e) {
            // error reading value
        }
    }

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

    validate() {
        Keyboard.dismiss();
        this.setState({ errors: "" });
        let valid = false;
        if (!(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))) {
            this.refs.toast.show("Please enter a valid email")
            // this.setState({ errors: "Please enter a valid email" });
        }
        else if (this.state.password.length < 8) {
            // this.setState({ errors: "Password should be at least of 8 characters" });
            this.refs.toast.show("Password should be at least of 8 characters")
        } else {
            this.signinUser();
        }
    }

    signinUser(stored, username, password) {
        var url = ip.ip.address;
        axios({
            method: 'post',
            url: url + "/signin",
            data: {
                email: stored ? username : this.state.email,
                password: stored ? password : this.state.password
            }
        }).then((response) => {
            // console.log(response.data);
            // this.setState({ base64: 'data:text/plain;base64,' + JSON.stringify(response.data.image) }, function () {
            //     console.log(this.state.base64)
            // })
            this.props.dispatch(userData(response.data));
            this.props.history.push("/map");
        }).catch((error) => {
            console.log("error")
            this.refs.toast.show(error.response.data.message)
            // this.setState({ errors: error.response.data.message });
        });
        // this.props.history.push("/profile");
    }

    signup() {
        this.props.history.push({
            pathname: "/signup"
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


    render() {
        return (
            <ImageBackground source = {image} style={styles.backgroundcontainer}>
                 <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <View style={styles.logocontainer}>
                    <Image source={logo} style={styles.logo}/> 
                    <Text style={styles.logotext}>FAST FOOD VISIT COUNTER</Text>
                </View>
                {/* <View>
                <ValidateForm errors={this.state.errors} />
                </View> */}

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
                         secureTextEntry={true} 
                         value={this.state.password}
                         onChange={this.handlePasswordChange}
                     />

                </View>
                <TouchableOpacity style = {styles.btnlogin} onPress={this.validate}>
                    <Text style={styles.text}>Login</Text>

                </TouchableOpacity>
                <View>
                <Text onPress={this.signup}>New User? &nbsp;</Text>
                        {/* <Button title="Sign Up" >
                        </Button> */}
                </View>
                </KeyboardAvoidingView>
                <Toast ref="toast" textStyle={{ color: 'red' }} fadeOutDuration={1000} fadeInDuration={2500} />
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
    logocontainer:{
        alignItems: 'center'
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 130
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // paddingTop: 40,
        // background Color: '#3066c9',
        height: '100%'
    },
    wrapper: {
        alignItems: 'center', paddingBottom: 40, paddingTop: 40
    },
    logotext:{
          color: 'red',
          fontSize: 20,
          fontWeight: '500',
          marginTop: 10,
          opacity: 0.5
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
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
    text:{
        color: "rgb(36,133,202)",
        fontSize: 16,
        textAlign: 'center',
    }
});

export default connect()(SignIn)