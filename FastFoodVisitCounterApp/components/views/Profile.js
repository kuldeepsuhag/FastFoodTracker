import React from 'react';
import { View, StyleSheet, BackHandler, Image, ImageBackground, TextInput, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
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

const { width: WIDTH } = Dimensions.get('window')
class Profile extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            showWeightModal: false,
            showHeightModal: false
        };
        this.showWeightDialog = this.showWeightDialog.bind(this);
        this.showHeightDialog = this.showHeightDialog.bind(this);
    }
    showWeightDialog() {
        this.setState({ showWeightModal: !(this.state.showWeightModal) });
    }
    showHeightDialog() {
        this.setState({ showHeightModal: !(this.state.showHeightModal) });
    }
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

    editdetails() {
        this.props.history.push({
            pathname: ""
        })
    }

    sendHeightInput = async (inputText) => {
        console.log("new Height", inputText)
        console.log("new Height int", parseInt(inputText, 10))
        var height = inputText
        this.setState({ showHeightModal: !(this.state.showHeightModal) });
        if (isNaN(parseInt(inputText, 10))) {
            this.refs.toast.show('Enter a valid number')
        }
        else {
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/updateheight",
                data: {
                    Height: height
                }
            }).then((response) => {
                console.log(response.data);
                //save the updated goal in profile redux!!
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    sendWeightInput = async (inputText) => {

        this.setState({ showWeightModall: !(this.state.showWeightModal) });
        if (isNaN(parseInt(inputText, 10))) {
            this.refs.toast.show('Enter a valid number')
        }
        else {
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/updateweight",
                data: {
                    stepGoal: "test"
                }
            }).then((response) => {
                console.log(response.data);
                //save the updated goal in profile redux!!
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    signout() {
        var url = ip.ip.address;
        var that = this;
        axios({
            method: 'post',
            url: url + "/signout",
        }).then((response) => {

            console.log(response.data)
            that.props.history.push("/");

        }).catch((error) => {
            console.log("error", error)

        });

    }

    disable() {
        var url = ip.ip.address;
        var that = this;
        axios({
            method: 'post',
            url: url + "/disable",
        }).then((response) => {

            console.log(response.data)
            //that.props.history.push("/");

        }).catch((error) => {
            console.log("error", error)

        });

    }

    render() {
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

                    <View style={{ marginLeft: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        {this.props.userDetails.image ?
                            <Image
                                style={styles.image}
                                source={{
                                    uri:
                                        'data:text/plain;base64,' + this.props.userDetails.image,
                                }}
                            /> : <Text>""</Text>}
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Personal Details</Text>
                    </View>
                    <ScrollView>
                        <View style={{ flex: 1 }}>

                            <View style={styles.headtext}>

                            </View>
                            <View style={{ marginLeft: 20 }}>
                                {/* <Text>PatientID : </Text> */}
                                <TextField

                                    editable={false}
                                    label='PatientID'

                                    value={this.props.userDetails.PatientID} />
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                {/* <Text>PatientID : </Text> */}
                                <TextField

                                    editable={false}
                                    label='Name'

                                    value={this.props.userDetails.name} />
                            </View>
                            <View style={{ marginLeft: 20 }}>
                                {/* <Text>PatientID : </Text> */}
                                <TextField

                                    editable={false}
                                    label='Email ID'

                                    value={this.props.userDetails.Email} />
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    {/* <Text>PatientID : </Text> */}
                                    <TextField

                                        editable={false}
                                        label='Height in cm'

                                        value={this.props.userDetails.height} />
                                </View>
                                <View style={styles.inputWrap}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#DDDDDD',
                                            padding: 10,
                                            marginLeft: 20,
                                            marginTop: 15,
                                            marginRight: 40

                                            //  width: WIDTH - 200,
                                            //  marginLeft: 110
                                        }}
                                        onPress={this.showHeightDialog}>
                                        <Text > Update </Text>


                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showHeightModal}
                                        title={"Height Update"}
                                        message={"Enter your current Height"}
                                        hintInput={"Eg. 60"}
                                        submitInput={(inputText) => { this.sendHeightInput(inputText) }}
                                        closeDialog={() => { this.showHeightDialog() }}>
                                    </DialogInput>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start' }}>
                                <View style={styles.inputWrap}>
                                    {/* <Text>PatientID : </Text> */}
                                    <TextField
                                        style={{ marginLeft: 20 }}
                                        editable={false}
                                        label='Weight in KG'

                                        value={this.props.userDetails.weight} />
                                </View>

                                <View style={styles.inputWrap}>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#DDDDDD',
                                            padding: 10,
                                            marginLeft: 20,
                                            marginTop: 15,
                                            marginRight: 40

                                            //  width: WIDTH - 200,
                                            //  marginLeft: 110
                                        }}
                                        onPress={this.showWeightDialog}>
                                        <Text > Update </Text>


                                    </TouchableOpacity>
                                    <DialogInput isDialogVisible={this.state.showWeightModal}
                                        title={"Weight Update"}
                                        message={"Enter your current Weight"}
                                        hintInput={"Eg. 60"}
                                        submitInput={(inputText) => { this.sendWeightInput(inputText) }}
                                        closeDialog={() => { this.showWeightDialog() }}>
                                    </DialogInput>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#DDDDDD',
                                        padding: 10,
                                        marginLeft: 20,
                                        marginTop: 15,
                                        marginRight: 40

                                        //  width: WIDTH - 200,
                                        //  marginLeft: 110
                                    }}
                                    onPress={this.signout}>
                                    <Text > Logout </Text>


                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#DDDDDD',
                                        padding: 10,
                                        marginLeft: 20,
                                        marginTop: 15,
                                        marginRight: 40

                                        //  width: WIDTH - 200,
                                        //  marginLeft: 110
                                    }}
                                onPress={this.disable()}>
                                    <Text > Deactivate Account </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ScrollView>
                </ImageBackground>
                <View style={{ height: 50, backgroundColor: '#ecf0f1' }}>
                    <AppFooter props={this.props} />
                </View>

            </View>

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
});

const mapStateToProps = (state) => {
    return {
        userDetails: state
    }
}

export default connect(mapStateToProps)(Profile); 