import React from 'react';
import { View, StyleSheet, BackHandler, Button, ImageBackground } from 'react-native';
import { Pedometer } from 'expo';
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
import { ScrollView } from 'react-native-gesture-handler';
import { stepData } from '../../redux/actions/index'

class Settings extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            showGoalModal: false,
            reload: false,
            visible: false,
            loaded: true,
            isPedometerAvailable: null
        };
        this.showGoalChangeDialog = this.showGoalChangeDialog.bind(this);
        this._getStepCounterData = this._getStepCounterData.bind(this);
    }

    componentDidMount() {
        console.log(this.props.currentGoal);
        if (this.props.currentGoal == null) {
            this.showGoalChangeDialog();
        }
        this._getStepCounterData();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    _getStepCounterData = async () => {
        Pedometer.isAvailableAsync().then(
            result => {
                this.setState({
                    isPedometerAvailable: String(result)
                });
            },
            error => {
                this.setState({
                    isPedometerAvailable: "Could not get is PedometerAvailable: " + error
                });
                console.log("Error with Pedometer: " + error)
            }
        );
        //Creating the data step data for the last week
        const today = new Date();
        let that = this;
        let DataForGraph = {}
        let dayLabels = []
        let noOfSteps = []
        let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        for (let i = 6; i > 0; i--) {

            let start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 0, 0, 0, 0)
            let end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i + 1, 0, 0, 0, 0)
            let dayString = weekDay[start.getDay()];

            Pedometer.getStepCountAsync(start, end).then(
                result => {
                    noOfSteps.push(result.steps);
                },
                error => {
                    noOfSteps.push(0);
                    console.log("Step Data Not Available");
                }
            );
            dayLabels.push(dayString)
        }

        setTimeout(function () {
            DataForGraph = {
                labels: dayLabels,
                datasets: [{
                    data: noOfSteps
                }]
            }
            that.props.dispatch(stepData(DataForGraph));
            that.setState({ loaded: false })
        }, 2000);
    }

    showGoalChangeDialog() {
        this.setState({ showGoalModal: !(this.state.showGoalModal) });
    }

    sendInput(inputText) {
        let stepGoal = parseInt(inputText, 10)
        let that = this
        this.setState({ showGoalModal: !(this.state.showGoalModal) });
        if (isNaN(parseInt(inputText, 10))) {
            this.refs.toast.show('Enter a valid number')
        }
        else {
            console.log(that.props.currentGoal)
            console.log(stepGoal)
            that.setState({
                visible: true
            })
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/updateValue",
                data: {
                    updateValue: stepGoal,
                    label: "currentGoal",
                    userId: this.props.userId
                }
            }).then((response) => {
                console.log(response.data);
                that.props.dispatch(currentGoal(stepGoal))
                that.setState({ visible: false })
            }).catch((error) => {
                console.log(error);
                that.setState({ visible: false })
            });
            that.setState({
                reload: !(that.state.reload)
            })
        }
    }

    handleBackPress = () => {
        this.props.history.goBack();
        return true;
    }

    render() {
        return (
            <>
                {this.state.loaded ? <AnimatedLoader
                    visible={true}
                    overlayColor="rgba(255,255,255,1)"
                    source={require("../../Images/loader.json")}
                    animationStyle={styles.lottie}
                    speed={1}
                /> :
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
                            <ScrollView>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <StepCounter />
                                        {/* <Text style={{ marginLeft: 130}}>Weekly Steps</Text> */}
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <DailyGoal />
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
                            </ScrollView>
                        </ImageBackground>
                        <View style={{ height: 50, backgroundColor: '#ecf0f1' }}>
                            <AppFooter props={this.props} />
                        </View>
                        <Toast ref="toast" textStyle={{ color: 'red' }} fadeOutDuration={2000} fadeInDuration={1000} />
                    </View>
                }
            </>
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
        currentGoal: userDetails.currentGoal,
        userId: userDetails.userID
    }
}

export default connect(mapStateToProps)(Settings); 