import React from 'react';
import { View, StyleSheet, BackHandler, Image, ImageBackground, Keyboard, Dimensions, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { Card, Text } from 'native-base';
import { Header, Button } from 'react-native-elements'
import AppFooter from '../footer/AppFooter'
import { connect } from 'react-redux'
// import { Route, Switch } from 'react-router-native'
import StepCounter from '../step-counter/stepCounter';
import { TextField } from 'react-native-material-textfield'
import DialogInput from 'react-native-dialog-input';
import ip from '../../config';
import axios from "axios";
import AnimatedLoader from "react-native-animated-loader";
import { setHeight, setWeight, setDoctorID, setPatientID } from '../../redux/actions/index'
import Toast, { DURATION } from 'react-native-easy-toast'

const { width: WIDTH } = Dimensions.get('window')
class Profile extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            showWeightModal: false,
            showHeightModal: false,
            showPatientModal: false,
            showDoctorModal: false,
            visible: false,
            bmi: 0,
            bmiString: "",
            bmiColor: "white"
        };
        this.showWeightDialog = this.showWeightDialog.bind(this);
        this.showHeightDialog = this.showHeightDialog.bind(this);
        this.showPatientDialog = this.showPatientDialog.bind(this);
        this.showDoctorDialog = this.showDoctorDialog.bind(this);
        this.bmi = this.bmi.bind(this);
        this.signout = this.signout.bind(this);
    }
    showWeightDialog(close) {
        if (close) { Keyboard.dismiss() }
        this.setState({ showWeightModal: !(this.state.showWeightModal) });
    }
    showHeightDialog(close) {
        if (close) { Keyboard.dismiss() }
        this.setState({ showHeightModal: !(this.state.showHeightModal) });
    }
    showPatientDialog(close) {
        if (close) { Keyboard.dismiss() }
        this.setState({ showPatientModal: !(this.state.showPatientModal) });
    }
    showDoctorDialog(close) {
        if (close) { Keyboard.dismiss() }
        this.setState({ showDoctorModal: !(this.state.showDoctorModal) });
    }
    componentDidMount() {
        this.bmi(this.props.userDetails.height, this.props.userDetails.weight);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userDetails.height != this.props.userDetails.height || prevProps.userDetails.weight != this.props.userDetails.weight) {
            this.bmi(this.props.userDetails.height, this.props.userDetails.weight);
        }
    }

    handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }

    editdetails() {
        this.props.history.push({
            pathname: ""
        })
    }

    bmi(height, weight) {
        if (height > 0 && weight > 0) {
            var bmi = 10000 * (weight / ((height) * (height)));
            var bmiString, bmiColor;
            bmi = Math.round(bmi * 100) / 100
            if (bmi < 18.5) {
                // bmi = bmi.toString() + " - Underweight"
                bmiString = "Underweight"
                bmiColor = "#ffa300"
            } else if (bmi >= 25) {
                // bmi = bmi.toString() + " - Overweight"
                bmiString = "Overweight"
                bmiColor = "#ff3d00"
            } else if (bmi >= 30) {
                // bmi = bmi.toString() + " - Obese"
                bmiString = "Obese"
                bmiColor = "#d31616"
            } else {
                // bmi = bmi.toString() + " - Normal"
                bmiString = "Normal"
                bmiColor = "#23a00c"
            }
            this.setState({ bmi: bmi, bmiString: bmiString, bmiColor: bmiColor })
        }
    }

    updateRedux(inputText, updateValue) {
        switch (updateValue) {
            case "height":
                this.props.dispatch(setHeight(inputText))
                break;
            case "weight":
                this.props.dispatch(setWeight(inputText))
                break;
            case "patient":
                this.props.dispatch(setPatientID(inputText))
                break;
            case "doctor":
                this.props.dispatch(setDoctorID(inputText))
                break;
        }
    }


    updateValue(inputText, updateValue) {
        switch (updateValue) {
            case "height":
                this.setState({ showHeightModal: !(this.state.showHeightModal) });
                break;
            case "weight":
                this.setState({ showWeightModal: !(this.state.showWeightModal) });
                break;
            case "patient":
                this.setState({ showPatientModal: !(this.state.showPatientModal) });
                break;
            case "doctor":
                this.setState({ showDoctorModal: !(this.state.showDoctorModal) });
                break;
        }
        if (isNaN(parseInt(inputText, 10))) {
            this.refs.toast.show('Enter a valid number')
        }
        else if (parseInt(inputText, 10) <= 0) {
            this.refs.toast.show("The value can't be zero")
        }
        else {
            this.setState({ visible: true })
            let that = this
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/updateValue",
                data: {
                    updateValue: inputText,
                    label: updateValue
                }
            }).then((response) => {
                that.setState({ visible: false })
                this.updateRedux(inputText, updateValue)
                console.log(response.data);
            }).catch((error) => {
                that.setState({ visible: false })
                console.log(error);
            });
        }
    }

    signout() {
        this.setState({ visible: true })
        var url = ip.ip.address;
        var that = this;
        console.log("signout")
        axios({
            method: 'post',
            url: url + "/signout",
        }).then((response) => {
            console.log(response.data)
            that.setState({ visible: false })
            AsyncStorage.clear();
            that.props.history.push("/");
        }).catch((error) => {
            that.setState({ visible: false })
            console.log("error", error)
        });

    }

    disable() {
        this.setState({
            visible: true
        })
        var url = ip.ip.address;
        var that = this;
        console.log("Test")
        axios({
            method: 'post',
            url: url + "/disable",
        }).then((response) => {
            console.log(response.data)
            that.setState({
                visible: false
            })
            //that.props.history.push("/");
        }).catch((error) => {
            console.log("error", error)
            that.setState({
                visible: false
            })
        });
    }

    render() {
        // renderBadge = (state) => {
        //     return class extends React.Component {
        //         render() {
        //             console.log(this.state)
        //             console.log(state)
        //             // if (this.state.bmi < 18.5) {
        //             //     // bmi = bmi.toString() + " - Underweight"
        //             //     return (
        //             //         <Badge info>Underweight</Badge>
        //             //     )
        //             // } else if (this.state.bmi >= 25) {
        //             //     // bmi = bmi.toString() + " - Overweight"
        //             //     return (
        //             //         <Badge warning>Overweight</Badge>
        //             //     )
        //             // } else if (this.state.bmi >= 30) {
        //             //     // bmi = bmi.toString() + " - Obese"
        //             //     return (
        //             //         <Badge danger>Obese</Badge>
        //             //     )
        //             // } else {
        //             //     // bmi = bmi.toString() + " - Normal"
        //             //     return (
        //             //         <Badge success>Normal</Badge>
        //             //     )
        //             // }
        //             return (
        //                 <Badge success>Normal</Badge>
        //             )
        //         }
        //     }
        // }

        // let BMIBadge = renderBadge(state)
        return (
            <View style={{ flex: 1, backgroundColor: '#00FFF' }}>
                <Header centerComponent={{
                    text: 'Profile', style: {
                        margin: 24,
                        fontSize: 15,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#34495e',
                    }
                }} />
                <ImageBackground source={require('../../Images/back.jpg')} style={styles.backgroundImage}>
                    <AnimatedLoader
                        visible={this.state.visible}
                        overlayColor="rgba(255,255,255,1)"
                        source={require("../../Images/loader.json")}
                        animationStyle={styles.lottie}
                        speed={1}
                    />
                    <View style={{ marginLeft: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        {this.props.userDetails.image ?
                            <Image style={styles.image} source={{
                                uri:
                                    'data:text/plain;base64,' + this.props.userDetails.image,
                            }}
                            /> : <Text></Text>}
                        {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Personal Details</Text> */}
                    </View>
                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginLeft: 20 }}>
                                <TextField editable={false} label='Name' value={this.props.userDetails.name} />
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                <TextField editable={false} label='Email ID' value={this.props.userDetails.Email} />
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    <TextField editable={false} label='Patient ID' value={this.props.userDetails.PatientID.toString()} />
                                </View>
                                <View style={styles.inputWrap}>
                                    <TouchableOpacity style={styles.updateBtn} onPress={this.showPatientDialog}>
                                        <Text style={styles.buttonText}> Update </Text>
                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showPatientModal}
                                        title={"Patient ID Update"}
                                        message={"Enter your new Patient ID"}
                                        submitInput={(inputText) => this.updateValue(inputText, "patient")}
                                        closeDialog={() => { this.showPatientDialog(true) }}
                                    >
                                    </DialogInput>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    <TextField editable={false} label='Doctor ID' value={this.props.userDetails.doctorId.toString()} />
                                </View>
                                <View style={styles.inputWrap}>
                                    <TouchableOpacity style={styles.updateBtn} onPress={this.showDoctorDialog}>
                                        <Text style={styles.buttonText}> Update </Text>
                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showDoctorModal}
                                        title={"Doctor ID Update"}
                                        message={"Enter your new Doctor ID"}
                                        submitInput={(inputText) => this.updateValue(inputText, "doctor")}
                                        closeDialog={() => { this.showDoctorDialog(true) }}
                                    >
                                    </DialogInput>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    <TextField editable={false} label='Height in cm' value={this.props.userDetails.height.toString()} />
                                </View>
                                <View style={styles.inputWrap}>
                                    <TouchableOpacity style={styles.updateBtn} onPress={this.showHeightDialog}>
                                        <Text style={styles.buttonText}> Update </Text>
                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showHeightModal}
                                        title={"Height Update"}
                                        message={"Enter your current Height"}
                                        hintInput={"Eg. 60"}
                                        submitInput={(inputText) => this.updateValue(inputText, "height")}
                                        closeDialog={() => { this.showHeightDialog(true) }}
                                    >
                                    </DialogInput>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    <TextField editable={false} label='Weight in KG' value={this.props.userDetails.weight.toString()} />
                                </View>
                                <View style={styles.inputWrap}>
                                    <TouchableOpacity style={styles.updateBtn} onPress={this.showWeightDialog}>
                                        <Text style={styles.buttonText}>Update</Text>
                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showWeightModal}
                                        title={"Weight Update"}
                                        message={"Enter your current Weight"}
                                        hintInput={"Eg. 60"}
                                        submitInput={(inputText) => this.updateValue(inputText, "weight")}
                                        closeDialog={() => { this.showWeightDialog(true) }}
                                    >
                                    </DialogInput>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    <TextField editable={false} label='BMI' value={this.state.bmi.toString()} />
                                    {/* <BMIBadge props={this.state}></BMIBadge> */}
                                </View>
                                {/* <Card style={styles.inputWrap} color={this.state.bmiColor}> */}
                                <View style={styles.BMILabelView}>
                                    <Text style={[styles.BMILabel, { backgroundColor: this.state.bmiColor, }]}>{this.state.bmiString} </Text>
                                </View>

                                {/* </Card> */}
                            </View>
                            <View>
                                <TouchableOpacity style={styles.updateBtn} onPress={this.signout}>
                                    <Text style={styles.buttonText}> Logout </Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.actionBtn} onPress={this.disable}>
                                    <Text style={styles.buttonText}> Deactivate Account </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>
                    <Toast ref="toast" textStyle={{ color: 'red' }} fadeOutDuration={1000} fadeInDuration={2500} />
                </ImageBackground >
                <View style={{ height: 50, backgroundColor: '#ecf0f1' }}>
                    <AppFooter props={this.props} />
                </View>

            </View >

        );
    }
}

const styles = StyleSheet.create({
    inputWrap: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginLeft: 20
    },
    updateBtn: {
        backgroundColor: 'rgb(67,167,238)',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        borderRadius: 45,
        justifyContent: 'center',
    },
    actionBtn: {
        backgroundColor: 'rgb(255,69,96)',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        borderRadius: 45,
        justifyContent: 'center',
    },
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
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e'
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,

    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        justifyContent: 'center'
    },
    headtext: {
        width: WIDTH - 55,
        fontWeight: 'bold',
        fontSize: 15,

    },
    input: {
        width: WIDTH - 55,
        fontSize: 16,
        paddingLeft: 45,
        // backgroundColor: 'rgb(151,214,240)',
        marginHorizontal: 25,
        marginBottom: '2%'
    },
    lottie: {
        width: 400,
        height: 400
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        textAlign: 'center',
    },
    BMILabel: {
        color: 'white',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        borderRadius: 45,
        justifyContent: 'center',
    },
    BMILabelView: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 20
    }
});

const mapStateToProps = (state) => {
    return {
        userDetails: state
    }
}

export default connect(mapStateToProps)(Profile); 