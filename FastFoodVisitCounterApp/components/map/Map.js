import React from 'react';
import { Constants, MapView, Location, Permissions, Pedometer, TaskManager } from 'expo';
import { StyleSheet, View, Alert, BackHandler, ImageBackground, FlatList } from 'react-native';
import AppFooter from '../footer/AppFooter'
import { Card, CardItem, Text } from 'native-base';
import { Button, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import ip from '../../config';
import axios from "axios";
import {connect} from 'react-redux'
import { stepData } from '../../redux/actions/index'
import {Header} from 'react-native-elements'
import AnimatedLoader from "react-native-animated-loader";
import Modal from "react-native-modal";

const LOCATION_TASK_NAME = 'background-location-task';
class Map extends React.Component {
  constructor(props, { }) {
    super(props);
    this.state = {
      mapRegion: null,
      hasLocationPermissions: false,
      locationResult: null,
      lat: null,
      long: null,
      city: null,
      roundedLat: null,
      roundedLong: null,
      isPedometerAvailable: "",
      countFastFood: 0,
      countPark: 0,
      visible: true,
      showRestModal: false,
      showParkModal: false,
      parkData: null,
      restData: null,
      lastStepDataTimestamp: null
    };
  }

  async componentDidMount() {
    this._getLocationAsync();
    this._getStepCounterData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
    this.sendStepData();
  }
  componentWillMount(){
    let that = this
    setTimeout(function () {
      that.setState({
        visible: false
      });
    }, 5000);
  }

  handleBackPress = () => {
    this.props.history.goBack();
    return true;
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
    // Send datelabel if date is needed
    // let dateLabels = []
    let dayLabels = []
    let noOfSteps = []
    let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    for (let i = 6; i > 0; i--) {

      let start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 0, 0, 0, 0)
      let end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i + 1, 0, 0, 0, 0)
      // Uncomment to get the state string
      // let dateString = startInterval.getDate() + '/' + (startInterval.getMonth() + 1) + '/' + startInterval.getFullYear();

      // let dayString = weekDay[prevDate.getDay()];
      let dayString = weekDay[start.getDay()];

      Pedometer.getStepCountAsync(start, end).then(
        result => {
          // Send datelabel if date is needed
          // Send datelabel if date is neededpr
          // dateLabels.push(dateString.toString());
          noOfSteps.push(result.steps);
        },
        error => {
          // Send datelabel if date is needed
          // dateLabels.push(dateString.toString());
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
    }, 2000);
  }

  formatDataForModal(historyData) {
    // console.log(historyData)
    for (let i = 0; i < historyData.length; i++) {
      historyData[i].index = i;
      let date = new Date(historyData[i].histimestamp)
      date = date.getDate("en-US", { timeZone: "Australia/Brisbane" }) + '/' + date.getMonth("en-US", { timeZone: "Australia/Brisbane" }) + '/' + date.getYear("en-US", { timeZone: "Australia/Brisbane" })
      historyData[i].date = date;
    }
    return historyData
  }

  getParkHistory = () => {
    // if (this.state.parkData == null) {
    var url = ip.ip.address;
    let historyData = []
    axios({
      method: 'post',
      url: url + "/getHistPark",
      data: {
        // latitude: lat,
        // longitude: lon
        // place: city
      }
    }).then((response) => {
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        historyData.push(response.data[i])
      }
      historyData = this.formatDataForModal(historyData);
      console.log(historyData[0])
      this.setState({ 
        showParkModal: true,
        parkData: historyData
       });
    }).catch((error) => {
      console.log(error);
    });
  }

  getRestHistory = () => {
    // if (this.state.restData == null) {
    var url = ip.ip.address;
    let historyData = []
    axios({
      method: 'post',
      url: url + "/getHistRest",
      data: {
        // latitude: lat,
        // longitude: lon
        // place: city
      }
    }).then((response) => {
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        historyData.push(response.data[i])
      }
      historyData = this.formatDataForModal(historyData);
      this.setState({
        showRestModal: true,
        restData: historyData
      });
      console.log(historyData[0])
    }).catch((error) => {
      console.log(error);
    });
  }

  sendStepData() {
    console.log("I am in")
    this.getLastSavedData();
    this.getDataForServer();
  }

  getLastSavedData() {
    console.log("Veendum in")
    // var url = ip.ip.address;
    // var that = this;
    // axios.get(url + "/get-last-date").then((response) => {
    //   console.log(response.data);
    //   this.setState({
    //     lastStepDataTimestamp: response.data
    //   })
    // }).catch((error) => {
    //   console.log(error);
    // });
    var myDate = "26-05-2019";
    this.setState({
      lastStepDataDate: myDate
    })
  }

  async getDataForServer(){
    let that = this
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

    let dataForServer = []
    let today = new Date()
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
    let nextRequiredDate = this.state.lastStepDataDate
    nextRequiredDate = nextRequiredDate.split("-")
    nextRequiredDate = new Date(parseInt(nextRequiredDate[2]), parseInt(nextRequiredDate[1]) - 1, parseInt(nextRequiredDate[0])+1, 0, 0, 0, 0)

    let numberOfDays = Math.round((today - nextRequiredDate) / (1000 * 60 * 60 * 24))

    for(let i= numberOfDays; i>0; i--){
      let stepDataObject = {}
      let start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 0, 0, 0, 0)
      let end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i + 1, 0, 0, 0, 0)
      stepDataObject.date = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();

      Pedometer.getStepCountAsync(start, end).then(
        result => {
          stepDataObject.step = result.steps
        },
        error => {
          console.log("error")
          stepDataObject.step = 0
        }
      );
      dataForServer.push(stepDataObject);
    }
    setTimeout(function () {
      // for (let i = 0; i < dataForServer.length; i++) {
      //   console.log(dataForServer[i].date)
      //   console.log(dataForServer[i].step)
      // }
      that._sendDataToServer(dataForServer)
    }, 2000);

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

  _handleMapRegionChange = async () => {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    let latitute = location.coords.latitude.toFixed(4)
    let longitude = location.coords.longitude.toFixed(4)
    this._getLocationAsync();
    // if (this.state.roundedLat == null && this.state.roundedLong == null) {
    //   this.setState({
    //     roundedLat: latitute,
    //     roundedLong: longitude
    //   })
    //   this._getLocationAsync();
    // } else if (this.state.roundedLat !== latitute ||
    //   this.state.roundedLong !== longitude) {
    //   this.setState({
    //     roundedLat: latitute,
    //     roundedLong: longitude
    //   })
    //   this._getLocationAsync();
    // }

  };

  _getLocationAsync = async () => {
    let isGPSOn = await Location.hasServicesEnabledAsync();
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Location Permissions Needed to proceed',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    if (isGPSOn) {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ locationResult: JSON.stringify(location) });

      // let latitute = location.coords.latitude
      // let longitude = location.coords.longitude

      // let locationObj = {
      //   latitude: latitute,
      //   longitude: longitude
      // }

      // let geoResult = await Location.reverseGeocodeAsync(locationObj)


      // this.setState({ locationResult: JSON.stringify(location) });
      this.setState({ lat: location.coords.latitude });
      this.setState({ long: location.coords.longitude });
      // this.setState({ city: (geoResult[0].city)?  geoResult[0].city: ""});

      // The map is sized according to the width and height specified in the styles and/or calculated by react-native.
      // The map computes two values, longitudeDelta/width and latitudeDelta/height, compares those 2 computed values, and takes the larger of the two.
      // The map is zoomed according to the value chosen in step 2 and the other value is ignored.
      // If the chosen value is longitudeDelta, then the left edge is longitude - longitudeDelta and the right edge is longitude + longitudeDelta. The top and bottom are whatever values are needed to fill the height without stretching the map.
      // If the chosen value is latitudeDelta, then the bottom edge is latitude - latitudeDelta and the top edge is latitude + latitudeDelta. The left and right are whatever values are needed to fill the width without stretching the map.
      this.setState({ mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } });
      // this.sendMapData(this.state.latitude, this.state.longitude, this.state.city)
      this.sendMapData(this.state.lat, this.state.long)
    } else {
      Alert.alert(
        'Location Services Are Disabled',
        'Please turn on location services to proceed.',
        [
          { text: 'Close App', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      )
    }
  };

  // sendMapData(lat, lon, city) {
  sendMapData(lat, lon) {
    let that = this
    var url = ip.ip.address;
    console.log("map data sent")
    if (lat != null && lon != null && lat != "" && lon != "") {
      axios({
        method: 'post',
        url: url + "/map-data",
        data: {
          latitude: lat,
          longitude: lon
          // place: city
        }
      }).then((response) => {
        that.setState({
          countFastFood: response.data.countRest,
          countPark: response.data.countPark,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  renderRow({ item }) {
    return (
      <ListItem
        title={item.histplace}
        subtitle={item.date}
      />
    )
  }
  render() {

    return (
      <>
        <View style={{flex: 1}}>
          <Header centerComponent={{
            text: 'Home Page', style: {
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
            <View>
              {
                this.state.locationResult === null ?
                  <Text>Finding your current location...</Text> :
                  this.state.hasLocationPermissions === false ?
                    <Text>Please provide location permissions.</Text> :
                    this.state.mapRegion === null ?
                      <Text>Map region doesn't exist.</Text> :
                      <MapView
                        style={{ alignSelf: 'stretch', height: '61.9%', marginTop: '-1%' }}
                        region={this.state.mapRegion}
                        showsUserLocation={true}
                        showsPointsOfInterest={false}
                        followsUserLocation={false}
                        zoomLevel={20}
                        provider="google"
                        onRegionChange={region => this.state.mapRegion = region}
                        onUserLocationChange={location => this._handleMapRegionChange(location)}
                      />
              }
              <Card style={styles.card} transparent>
                <CardItem>
                  <Button
                    buttonStyle={{ backgroundColor: "red" , width: 50, marginRight: 5}}
                    icon={
                      <Icon
                        name="md-pizza"
                        size={15}
                        color="white"
                      />
                    }
                    onPress={this.getRestHistory}
                    title={" " + this.state.countFastFood.toString()}
                  />
                  <Button
                    buttonStyle={{ backgroundColor: "green", width: 50, marginLeft: 5}}
                    icon={
                      <Icon
                        name="ios-american-football"
                        size={15}
                        color="white"
                      />
                    }
                    onPress={this.getParkHistory}
                    title={" " + this.state.countPark.toString()}
                  />
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Text>Location Data: {this.state.locationResult}</Text>
                </CardItem>
              </Card>
            </View>
          </ImageBackground>
          <Modal isVisible={this.state.showRestModal}>
            <Card>
              <CardItem header>
                <Text>Restaurant History</Text>
              </CardItem>
              <CardItem>
                {/* <List> */}
                <FlatList
                  // data={dataRest}
                  data={this.state.restData}
                  renderItem={this.renderRow}
                  keyExtractor={item => item.index.toString()}
                />
                {/* </List> */}
              </CardItem>
              <CardItem>
                <Button title="Hide" onPress={() => { this.setState({ showRestModal : false })  }} />
              </CardItem>
            </Card>
          </Modal>
          <Modal isVisible={this.state.showParkModal}>
            <Card>
              <CardItem header>
                <Text>Park History</Text>
              </CardItem>
              <CardItem>
                {/* <List> */}
                <FlatList
                  data={this.state.parkData}
                  // data={dataPark}
                  renderItem={this.renderRow}
                  keyExtractor={item => item.index.toString()}
                />
                {/* </List> */}
              </CardItem>
              <CardItem>
                <Button title="Hide" onPress={() => { this.setState({showParkModal : false}) }} />
              </CardItem>
            </Card>
          </Modal>
        </View>
        <AppFooter props={this.props}/>
      </>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("error" + error.message)
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('background locations', locations)
    let lat = locations[0].coords.latitude
    let lon = locations[0].coords.longitude
    let locationObj = {
      latitude: lat,
      longitude: lon
    }

    var url = ip.ip.address;

    axios({
      method: 'post',
      url: url + "/map-data",
      data: {
        latitude: lat,
        longitude: lon,
        place: ""
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });

  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: '5%',
    marginRight: '5%',
    maxWidth: '100%'
  },
  backgroundImage:{
    flex:1,
    alignSelf: 'stretch',
    width: null,
    justifyContent: 'center'
  },
  lottie: {
    width: 400,
    height: 400
  }
});

export default connect()(Map)