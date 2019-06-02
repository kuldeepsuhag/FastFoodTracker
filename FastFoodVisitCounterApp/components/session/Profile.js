import React from 'react';
import { Label, Text } from 'native-base';
import {
    View, StyleSheet, Image, AsyncStorage, ImageBackground, TextInput, Dimensions,
    Keyboard, ScrollView, BackHandler, KeyboardAvoidingView, Alert
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import ip from '../../config';
import axios from "axios";
import { connect } from 'react-redux'
import { loggedIn, userData } from '../../redux/actions/index'
import logo from '../../Images/logo.gif'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Button } from 'react-native-elements';
import AnimatedLoader from "react-native-animated-loader";
const { width: WIDTH } = Dimensions.get('window')
class Profile extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            name: "",
            doctor: "",
            height: 0,
            weight: 0,
            bmi: 0,
            image: null,
            visible: false,
            base64: null
        };
        this.height = this.height.bind(this);
        this.bmi = this.bmi.bind(this);
        this.weight = this.weight.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handleDocIDChange = this.handleDocIDChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleWeighttChange = this.handleWeighttChange.bind(this);

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

    height(e) {
        this.setState({ height: e.nativeEvent.text }, function () {
            this.bmi();
        });

    }

    weight(e) {
        this.setState({ weight: e.nativeEvent.text }, function () {
            this.bmi();
        });
    }

    bmi(height, weight) {
        if (height > 0 && weight > 0) {
            var bmi = 10000 * (weight / ((height) * (height)));
            bmi = Math.round(bmi * 100) / 100
            this.setState({ bmi: bmi })
        }
    }

    handleFullNameChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ name: processedData })
    }

    handleDocIDChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ doctor: processedData })
    }

    handleHeightChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ height: processedData })
        this.bmi(processedData, this.state.weight);
    }

    handleWeighttChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({ weight: processedData })
        this.bmi(this.state.height, processedData);
    }

    storeData = async () => {
        console.log("savingg");
        var that = this;
        try {
            console.log(this.props.userData.email)
            const username = ["@username", this.props.userData.email]
            const password = ["@password", this.props.userData.password]
            await AsyncStorage.multiSet([username, password], function () {
                console.log("Saved");
                // that.props.dispatch(loggedIn(true));
                that.props.history.push("/map");
            })
            console.log(akshay);
        } catch (e) {
            // saving error
        }
    }

    submitProfile() {
        Keyboard.dismiss()
        this.setState({visible:true})
        let that = this
        var url = ip.ip.address;
        axios({
            method: 'post',
            url: url + "/signup",
            data: {
                email: this.props.userData.email,
                password: this.props.userData.password,
                patientId: this.props.userData.id,
                doctorId: this.state.doctor,
                name: this.state.name,
                height: this.state.height,
                weight: this.state.weight,
                image: this.state.base64
            }
        }).then((response) => {
            console.log("SIGN UP DONE !!")
            that.setState({visible: false})
            console.log(response.data);
            that.props.dispatch(userData(response.data));
            this.storeData();
        }).catch((error) => {
            that.setState({visible: false})
            console.log(error);
        });
    }

    setImage(result){
        if (!result.cancelled) {
            this.setState({ base64: result.base64.replace(/(?:\r\n|\r|\n)/g, '') })
            this.setState({ image: result.uri });
        }
    }

    getImage = async (camera) => {
        if (camera) {
            let { camera } = await Permissions.askAsync(Permissions.CAMERA);
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                base64: true
            });
            this.setImage(result)
        } else {
            let { camera_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                base64: true
            });
            this.setImage(result)
        }
    }

    _pickImage = async () => {
        Alert.alert(
            'Choose an Image Source',
            'Profile Picture',
            [
                { text: 'Camera', onPress: () => this.getImage(true) },
                {
                    text: 'Gallery',
                    onPress: () => this.getImage(false)
                }
            ],
            { cancelable: false },
        );
    };

    render() {
        //  console.log(this.state.email);
        return (
            <ImageBackground source={require('../../Images/back.jpg')} style={styles.backgroundcontainer}>
                <AnimatedLoader
                    visible={this.state.visible}
                    overlayColor="rgba(255,255,255,1)"
                    source={require("../../Images/loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                />
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={1}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.logocontainer}>
                                <Image source={logo} style={styles.logo} />
                            </View>
                            <View style={styles.logocontainer}>
                                <Text style={styles.logotext}>FAST FOOD VISIT COUNTER</Text>
                            </View>
                            <View style={styles.logocontainer}>
                                <Text style={styles.logotext}>Patient Info</Text>
                            </View>
                            <View style={styles.imageContainer}>
                                {this.state.image &&
                                    <Image source={{ uri: this.state.image }} style={styles.image} />}
                                    <Button title="Profile Picture" raised onPress={this._pickImage} buttonStyle={styles.nextButton}></Button>
                            </View>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Full Name'}
                                    placeholderTextColor={'rgb(36,133,202)'}
                                    underlineColorAndroid='transparent'
                                    value={this.state.name}
                                    onChange={this.handleFullNameChange}
                                />
                            </View>
                            <View>
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Doctor ID'}
                                    placeholderTextColor={'rgb(36,133,202)'}
                                    keyboardType="numeric"
                                    underlineColorAndroid='transparent'
                                    value={this.state.doctor}
                                    onChange={this.handleDocIDChange}
                                />
                            </View>

                            <View>
                                <Label style={styles.label}>Height (in cms) </Label>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'rgb(36,133,202)'}
                                    underlineColorAndroid='transparent'

                                    value={String(this.state.height)}
                                    keyboardType="numeric"
                                    onChange={this.handleHeightChange}
                                />
                            </View>
                            <View>
                                <Label style={styles.label}> Weight (in kgs)</Label>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'rgb(36,133,202)'}
                                    underlineColorAndroid='transparent'
                                    value={String(this.state.weight)}
                                    keyboardType="numeric"
                                    onChange={this.handleWeighttChange}
                                />
                            </View>
                            <View>
                                <Label style={styles.label}> BMI (Body Mass Index)</Label>
                                <Text style={{ marginLeft: 30 }}>{this.state.bmi}</Text>
                            </View>
                            <View style={styles.action}>
                                <Button title="Submit" raised onPress={this.submitProfile} buttonStyle={styles.nextButton}></Button>
                            </View>
                        </View >
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    backgroundcontainer: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center'
    },
    keycontainer: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // paddingTop: 40,
        // backgroundColor: '#3066c9',
        height: '100%',
        marginBottom: 30,
        marginTop: 10
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
    logotext: {
        color: 'red',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.5
    },
    logocontainer: {
        alignItems: 'center'
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    text: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 130

    },
    label: {
        marginLeft: 30,
        fontSize: 15,
    },
    imagebutton: {
        width: 150,
        height: 45,
        borderRadius: 45,
        backgroundColor: 'rgb(36,133,202)',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: '2%',
        // marginLeft: 100

    },
    btnsubmit: {
        width: 100,
        height: 45,
        borderRadius: 45,
        backgroundColor: "#432577",
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: '2%',
        marginLeft: 130

    },
    action: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%',
        marginTop: '3%'
    },
    logintext: {
        color: "rgb(36,133,202)",
        fontSize: 16,
        textAlign: 'center'
    },
    whiteText: {
        color: "white"
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center'
    },
    nextButton: {
        backgroundColor: 'rgb(36,133,202)',
        borderRadius: 45,
        paddingLeft: 40,
        paddingRight: 40,
    },
    lottie: {
        width: 400,
        height: 400
    }
});

const mapStateToProps = (state) => {
    return {
        userData: state
    }
}

export default connect(mapStateToProps)(Profile); 