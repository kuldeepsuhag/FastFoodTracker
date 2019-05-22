import React from 'react';
import { View, StyleSheet, BackHandler, Button } from 'react-native';
import { Text } from 'native-base';
import AppFooter  from '../footer/AppFooter'
import StepCounter from '../step-counter/stepCounter';
import DailyGoal from '../daily-goal/dailyGoal'
import DialogInput from 'react-native-dialog-input';
import ip from '../../config';
import axios from "axios";
import Toast, { DURATION } from 'react-native-easy-toast'

export default class Settings extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            showGoalModal: false
        };
        this.showGoalDialog = this.showGoalDialog.bind(this);
    }

    showGoalDialog(){
        this.setState({ showGoalModal: !(this.state.showGoalModal)});
    }
    sendInput = async (inputText) => {
        console.log("new goal", inputText)
        console.log("new goal int", parseInt(inputText, 10))
        this.setState({ showGoalModal: !(this.state.showGoalModal) });
        if (isNaN(parseInt(inputText, 10))){
            this.refs.toast.show('Enter a valid number')
        }
        else{
            var url = ip.ip.address;
            axios({
                method: 'post',
                url: url + "/new-step-goal",
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

    render() {

        return (
            <View style={{flex: 1}}>
                <Text style={styles.paragraph}>
                    User Daily Steps
                </Text>
                <View style={{flex: 1, backgroundColor: '#ecf0f1'}}>
                    <View>
                        <StepCounter></StepCounter>
                    </View>
                    <View style = {{flexDirection: "row"}}>
                        <DailyGoal></DailyGoal>
                    </View>
                    <View style={{ flexDirection: "row" , justifyContent: "center", marginTop: 10}}>
                        <Button onPress={this.showGoalDialog} title="Update Goal"></Button>
                        <DialogInput isDialogVisible={this.state.showGoalModal}
                            title={"Change Daily Step Goal"}
                            message={"Enter the new goal"}
                            hintInput={"Eg. 5000"}
                            submitInput={(inputText) => { this.sendInput(inputText) }}
                            closeDialog={() => { this.showGoalDialog() }}>
                        </DialogInput>
                    </View>
                </View>
                <View style={{height: 50, backgroundColor: '#ecf0f1'}}>
                    < AppFooter props={this.props}/>
                </View>
                <Toast ref="toast" textStyle={{ color: 'red' }} fadeOutDuration={2000} fadeInDuration={1000}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    settings: {
      backgroundColor: 'white',
    },
    card:{
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
    }
});