import Expo from "expo";
import React from "react";
import { Pedometer } from "expo";
import { StyleSheet, Text, View } from "react-native";
import { BarChart, Grid } from 'react-native-svg-charts'

export default class StepCounter extends React.Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
    pastWeekStepCountData: []
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });

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
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
    
    //Creating the data step data for the last week
    const today = new Date();
    const prevDate = new Date();
    let stepCountHolder = [];
    for(let i=7;i>0;i--){
      let stepData = {};
      prevDate.setDate(today.getDate() - i);
      const startInterval = new Date();
      const endInterval = new Date();
      startInterval.setDate(prevDate.getDate());
      endInterval.setDate(prevDate.getDate() + 1)
      let dateString = startInterval.getDate() + '/' +  (startInterval.getMonth()+1) + '/' + startInterval.getFullYear();
      Pedometer.getStepCountAsync(startInterval, endInterval).then(
        result => {
          stepData['date'] = dateString.toString();
          stepData['steps'] = result.steps;
          stepCountHolder.push(stepData);
        },
        error => {
          stepData['date'] = dateString.toString();
          stepData['steps'] = 0;
          console.log("Step Data Not Available");
          stepCountHolder.push(stepData);
        }
      );
    }
    setTimeout(function(){
      console.log("------checking------")
      let dataForGraph = [];
      stepCountHolder.forEach(element => {
        dataForGraph.push(element['steps']);
      });
      console.log("test")
      console.log(dataForGraph)
      console.log("test 1")
    }, 5000);
  };
  
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>
          Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
        </Text>
        <Text>
          Steps taken in the last 24 hours: {this.state.pastStepCount}
        </Text>
        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text> */}
        <BarChart
                style={{ height: 200 }}
                data={ [10, 34, 22, 54, 21, 100] }
                contentInset={{ top: 30, bottom: 30 }}
            >
                <Grid/>
            </BarChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
