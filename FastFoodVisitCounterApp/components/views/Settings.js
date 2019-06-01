import React from 'react';
import { View, StyleSheet, BackHandler, Button, ImageBackground } from 'react-native';
import { Text } from 'native-base';
import AppFooter from '../footer/AppFooter'
import StepCounter from '../step-counter/stepCounter';
import DailyGoal from '../daily-goal/dailyGoal'
import DialogInput from 'react-native-dialog-input';
import ip from '../../config';
import image from '../../Images/back.jpg'
import axios from "axios";
import Toast, { DURATION } from 'react-native-easy-toast'
import { connect } from 'react-redux'
import { currentGoal } from '../../redux/actions/index'
import { Header } from 'react-native-elements'
import AnimatedLoader from "react-native-animated-loader";

 class Settings extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            showGoalModal: false,
            reload: false,
            visible: false
        };
        this.showGoalChangeDialog = this.showGoalChangeDialog.bind(this);
    }

    showGoalChangeDialog(){
        this.setState({ showGoalModal: !(this.state.showGoalModal)});
    }

    sendInput(inputText){
        let stepGoal = parseInt(inputText, 10)
        let that = this
        this.setState({ showGoalModal: !(this.state.showGoalModal) });
        if (isNaN(parseInt(inputText, 10))) {
            this.refs.toast.show('Enter a valid number')
        }
        else{
            console.log(that.props.currentGoal)
            console.log(stepGoal)
            that.setState({
                visible: true
            })
            that.props.dispatch(currentGoal(stepGoal))
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/updateValue",
                data: {
                    updateValue: stepGoal,
                    label: "currentGoal"
                }
            }).then((response) => {
                console.log(response.data);
                that.setState({
                    visible: true
                })
               // that.props.dispatch(userData(that.props.userDetails.state.currentGoal))
            }).catch((error) => {
                console.log(error);
                that.setState({
                    visible: true
                })
            });
            that.setState({
                reload: !(that.state.reload)
            })
        }
    }
    componentDidMount() {
        console.log(this.props.currentGoal);
        if(this.props.currentGoal == null) {
            this.showGoalChangeDialog();
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }


    render() {

        return (

            <View style={{ flex: 1 }}>
                <Header centerComponent={{
                    text: 'Analysis', style: {
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
                <View style={{ flex: 1}}>
                    
                        <View>
                            <StepCounter></StepCounter>
                            <Text style={{ marginLeft: 130}}>Weekly Steps</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <DailyGoal></DailyGoal>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                            <Button onPress={this.showGoalChangeDialog} title="Update Goal"></Button>
                            <DialogInput isDialogVisible={this.state.showGoalModal}
                                title={"Change Daily Step Goal"}
                                message={"Enter the new goal"}
                                hintInput={"Eg. 5000"}
                                submitInput={(inputText) => { this.sendInput(inputText) }}
                                closeDialog={() => { this.showGoalChangeDialog() }}>
                            </DialogInput>
                        </View>
                    
                </View>
                </ImageBackground>
                <View style={{ height: 50, backgroundColor: '#ecf0f1' }}>
                    < AppFooter props={this.props} />
                </View>
                <Toast ref="toast" textStyle={{ color: 'red' }} fadeOutDuration={2000} fadeInDuration={1000} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
        backgroundColor: 'white',
    },
    card: {
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        justifyContent: 'center'
    },
    lottie: {
        width: 400,
        height: 400
    }
});

const mapStateToProps = (userDetails) => {
    return {
        currentGoal: userDetails.currentGoal
    }
}

export default connect(mapStateToProps)(Settings); 