import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon } from 'react-native-elements';
import { Pedometer } from "expo";
import { connect } from 'react-redux';

const tintColor = "#16d353";
const backgroundColor = "#c4c4c4";
const rotation = 360;

const dayDim = {
    size: 270,
    width: 10,
    iconSize: 50
};

class DailyGoal extends React.Component{
    constructor(props, { }) {
        super(props);
        this.state = {
            fill: 0,
            currentStepCount: 0,
            goal: 20000,
            pastStepCount: 0,
        };
    }

    componentWillMount(){
        this._subscribe();
        this.setState({
            goal: this.props.currentGoal
        })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.goal !== this.props.currentGoal){
            this.setState({
                goal: this.props.currentGoal
            }, () => {
                this._subscribe();
            })
        }
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

        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        const temp = new Date();
        const end = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), 0, 0, 0, 0);
        const start = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate()-1, 0,0,0,0);
        
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
                                        Daily Goal: {this.state.goal}
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

const mapStateToProps = (userDetails) => {
    return {
        currentGoal: userDetails.currentGoal
    }
}

export default connect(mapStateToProps)(DailyGoal);