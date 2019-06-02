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
      parkData: [],
      restData: []
    };
  }

  toggleRestModal = () => {
    this.setState({ showRestModal: !this.state.showRestModal });
    getRestHistory()
  };
  
  toggleParkModal = () => {
    this.setState({ showParkModal: !this.state.showParkModal });
    getParkHistory()
  };

  async componentDidMount() {
    this._getLocationAsync();
    this._getStepCounterData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
  componentWillMount(){
    let that = this
    setTimeout(function () {
      that.setState({
        visible: !that.state.visible
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
    
    getRestHistory = () =>{
      // var url = ip.ip.address;
      // var that = this;
      // axios.get(url + "/get-rest-history").then((response) => {
      //   console.log(response.data);
      //   this.setState({
      //     restData: response.data
      //   })
      // }).catch((error) => {
      //   console.log(error);
      // });
      this.setState({
        restData: [
        {
          index: 1,
          name: 'KFC Carlton',
          date: '02/05/3028',
          time: '8:00 AM'
        },
        {
          index: 2,
          name: 'KFC Carlton',
          date: '05/05/3028',
          time: '8:00 AM'
        },
        {
          index: 3,
          name: 'KFC Carlton',
          date: '06/05/3028',
          time: '8:00 AM'
        },
        {
          index: 4,
          name: 'KFC Carlton',
          date: '08/05/3028',
          time: '8:00 AM'
        },
        {
          index: 5,
          name: 'KFC Carlton',
          date: '02/04/3028',
          time: '8:00 AM'
        },
        ]
      })
      return
    }

    getParkHistory = () => {
      // var url = ip.ip.address;
      // var that = this;
      // axios.get(url + "/get-park-history").then((response) => {
      //   this.setState({
      //     parkData: response.data
      //   })
      // }).catch((error) => {
      //   console.log(error);
      // });
      this.setState({
        parkData: [
          {
            index: 1,
            name: 'Lincoln Garden',
            date: '02/03/3028',
            time: '8:00 AM'
          },
          {
            index: 2,
            name: 'Lincoln Garden',
            date: '05/06/3028',
            time: '8:00 AM'
          },
          {
            index: 3,
            name: 'Lincoln Garden',
            date: '04/05/3028',
            time: '8:00 AM'
          },
          {
            index: 4,
            name: 'Carlton Garden',
            date: '01/05/3028',
            time: '8:00 AM'
          },
          {
            index: 5,
            name: 'Carlton Garden',
            date: '02/05/3028',
            time: '8:00 AM'
          },
        ]
      })
      return
    }

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

  _handleMapRegionChange = async () => {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
    let latitute = location.coords.latitude.toFixed(4)
    let longitude = location.coords.longitude.toFixed(4)

    if (this.state.roundedLat == null && this.state.roundedLong == null) {
      this.setState({
        roundedLat: latitute,
        roundedLong: longitude
      })
      this._getLocationAsync();
    } else if (this.state.roundedLat !== latitute ||
      this.state.roundedLong !== longitude) {
      this.setState({
        roundedLat: latitute,
        roundedLong: longitude
      })
      this._getLocationAsync();
    }

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
      this.sendMapData(this.state.lat, this.state.lon)
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
    var url = ip.ip.address;
    console.log("map data sent")
    axios({
      method: 'post',
      url: url + "/map-data",
      data: {
        latitude: lat,
        longitude: lon
        // place: city
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  renderRestRow({ item }) {
    return (
      <ListItem
        title={item.name}
        subtitle={item.date}
      />
    )
  }
  renderParkRow({ item }) {
    return (
      <ListItem
        title={item.name}
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
                    onPress={this.toggleRestModal}
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
                    onPress={this.toggleParkModal}
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
                        renderItem={this.renderRestRow}
                        keyExtractor={item => item.index.toString()}
                      />
                    {/* </List> */}
              </CardItem>
              <CardItem>
                <Button title="Hide modal" onPress={this.toggleRestModal} /> 
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
                    renderItem={this.renderParkRow}
                    keyExtractor={item => item.index.toString()}
                  />
                {/* </List> */}
              </CardItem>
              <CardItem>
                <Button title="Hide modal" onPress={this.toggleParkModal} />
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