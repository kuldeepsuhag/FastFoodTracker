import Expo from "expo";
import React from "react";
import { Pedometer } from "expo";
import { StyleSheet, Text, View } from "react-native";
import { BarChart, Grid, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'

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
    let that = this;
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
          stepData.label = dateString.toString();
          stepData.value = result.steps;
          stepCountHolder.push(stepData);
        },
        error => {
          stepData.label = dateString.toString();
          stepData.value = 0;
          console.log("Step Data Not Available");
          stepCountHolder.push(stepData);
        }
      );
    }
    setTimeout(function(){
      console.log("------checking------")
      // let dataForGraph = [];
      stepCountHolder.forEach(element => {
        // dataForGraph.push(element['value']);
        console.log(element)
        console.log("####")
      });
      console.log(stepCountHolder)
      that.setState({ pastWeekStepCountData: stepCountHolder });
    }, 5000);
  };
  
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {

    const data = [
      {
          value: 50,
          label: 'One',
      },
      {
          value: 10,
          label: 'Two',
      },
      {
          value: 40,
          label: 'Three',
      },
      {
          value: 95,
          label: 'Four',
      },
      {
          value: 85,
          label: 'Five',
      },
    ]


    return (
      <View style={{ flexDirection: 'row', height: '75%', paddingVertical: 16 }}>
        {/* <Text>
          Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
        </Text>
        <Text>
          Steps taken in the last 24 hours: {this.state.pastStepCount}
        </Text>
        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text> */}

        <YAxis
            // data={this.state.pastWeekStepCountData}
            data={data}
            yAccessor={({ index }) => index}
            scale={scale.scaleBand}
            contentInset={{ top: 10, bottom: 10 }}
            spacing={0.2}
            formatLabel={(_, index) => data[ index ].label}
        />
        <BarChart
            style={{ flex: 1, marginLeft: 8 }}
            // data={this.state.pastWeekStepCountData}
            data={data}
            horizontal={true}
            yAccessor={({ item }) => item.value}
            svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
            contentInset={{ top: 10, bottom: 10 }}
            spacing={0.2}
            gridMin={0}
        >
            <Grid direction={Grid.Direction.VERTICAL}/>
        </BarChart>
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 15,
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });
