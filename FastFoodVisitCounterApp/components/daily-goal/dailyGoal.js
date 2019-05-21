import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon } from 'react-native-elements';
import { Pedometer } from "expo";

const tintColor = "#00e0ff";
const backgroundColor = "#717BA5";
const rotation = 360;

const dayDim = {
    size: 270,
    width: 10,
    iconSize: 50
};

export default class DailyGoal extends React.Component{

    state = {
        fill: 0,
        currentStepCount: 0,
        goal: 10000,
        pastStepCount: 0
    };

    componentWillMount(){
        this._subscribe();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    _calculateFill(goal, steps){
        let percentCompleted = (steps/goal)*100;
        this.setState({
            fill: percentCompleted
        });
    }

    _subscribe = () => {
        this._subscription = Pedometer.watchStepCount(result => {
            this.setState({
                currentStepCount: result.steps
            });
            this._calculateFill(this.state.goal, this.state.currentStepCount);
        });

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        Pedometer.getStepCountAsync(start, end).then(
            result => {
                this.setState({ pastStepCount: result.steps });
                this._calculateFill(this.state.goal, this.state.pastStepCount);
            },
            error => {
                this.setState({
                    pastStepCount: "Could not get stepCount: " + error
                });
            }
        );
    };

    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };
    
    render() {
        const data = this.props.dailyStep
        return (
            <View style={styles.container}>
                <AnimatedCircularProgress
                    size={dayDim.size}
                    width={dayDim.width}
                    fill={this.state.fill}
                    tintColor={tintColor}
                    backgroundColor={backgroundColor}
                    rotation={rotation}
                >
                    {
                        (fill) => (
                            <View style={styles.dayFill}>
                                <Icon
                                    name='blind'
                                    type='font-awesome'
                                    color='#0365d6'
                                    disabledStyle
                                    size={50}
                                     />
                                <Text style={styles.steps}>
                                    {(this.state.currentStepCount > this.state.pastStepCount)? this.state.currentStepCount : this.state.pastStepCount} Steps
                                </Text>
                                <Text style={styles.goal}>
                                    Goal: {this.state.goal}
                            </Text>
                            </View>
                        )
                    }
                </AnimatedCircularProgress>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    dayFill: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 10,
        left: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 250,
        height: 250
    },
    steps: {
        backgroundColor: 'transparent',
        fontSize: 30,
        textAlign: 'center',
        color: '#2485ca'
    },
    goal: {
        color: '#0365d6'
    }
});