import Expo from "expo";
import React from "react";
import { Pedometer } from "expo";
import { StyleSheet, Text, View } from "react-native";
// import { BarChart, Grid, YAxis } from 'react-native-svg-charts'
// import * as scale from 'd3-scale'
import ip from '../../config';
import axios from "axios";
import {connect} from 'react-redux'
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit'
class StepCounter extends React.Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0
  };
  
  _getDataFromServer = () =>{
    var url = ip.ip.address;
    var that = this;
    axios.get(url + "/get-step-data").then((response) => {
      console.log(response.data);
    }).catch((error) => {
      that.setState({dataAvailable: false});
      console.log(error);
    });
  }

  _sendDataToServer = (stepDataForServer) => {
    var url = ip.ip.address;
    axios({
      method: 'post',
      url: url + "/step-data",
      data: stepDataForServer
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {

    const data  = this.props.stepData

    const chartConfig = {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(255, 50, 50, ${opacity})`,
      strokeWidth: 3 // optional, default 3
    }
    return (
      <View>
        <BarChart
          style={{marginVertical: 8, borderRadius: 16}}
          data={data}
          width={Dimensions.get('window').width - 3}
          height={220}
          // yAxisLabel={'$'}
          chartConfig={chartConfig}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stepData: state.stepData
  }
}

export default connect(mapStateToProps)(StepCounter);