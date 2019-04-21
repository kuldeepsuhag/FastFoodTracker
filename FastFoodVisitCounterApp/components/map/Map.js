import React from 'react';
import { Constants, MapView, Location, Permissions } from 'expo';
import { StyleSheet, View, Alert, BackHandler } from 'react-native';
import AppFooter  from '../footer/AppFooter'
import StepCounter from '../step-counter/stepCounter';
import { Card, CardItem, Text, Body } from 'native-base';

export default class Map extends React.Component {
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion);
    this.setState({ mapRegion });
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

   if(isGPSOn){
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });
  
   let location = await Location.getCurrentPositionAsync({});

   let latitute = location.coords.latitude
   let longitude = location.coords.longitude

   let locationObj = {
     latitude: latitute,
     longitude: longitude
   }

   let geoResult = await Location.reverseGeocodeAsync(locationObj)

   console.log("######")
   console.log(geoResult)
   console.log("######")
   
   this.setState({ locationResult: JSON.stringify(location) });

    // The map is sized according to the width and height specified in the styles and/or calculated by react-native.
    // The map computes two values, longitudeDelta/width and latitudeDelta/height, compares those 2 computed values, and takes the larger of the two.
    // The map is zoomed according to the value chosen in step 2 and the other value is ignored.
    // If the chosen value is longitudeDelta, then the left edge is longitude - longitudeDelta and the right edge is longitude + longitudeDelta. The top and bottom are whatever values are needed to fill the height without stretching the map.
    // If the chosen value is latitudeDelta, then the bottom edge is latitude - latitudeDelta and the top edge is latitude + latitudeDelta. The left and right are whatever values are needed to fill the width without stretching the map.
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
   }else{
    Alert.alert(
      'Location Services Are Disabled',
      'Please turn on location services to proceed.',
      [
        {text: 'Close App', onPress: () => BackHandler.exitApp()},
      ],
      { cancelable: false }
    )
   }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Fast Food Visit Counter App
        </Text>

        {
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Please provide location permissions.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={{ alignSelf: 'stretch', height: '50%' }}
              region={this.state.mapRegion}
              showsUserLocation={true}
              onRegionChange={this._handleMapRegionChange}
            />
        }

        {/* <Card style={styles.card}> */}
                {/* <StepCounter/> */}
        {/* </Card> */}


        <Card style={styles.card}>
              <CardItem>
                <Text>Location Data: {this.state.locationResult}</Text>
              </CardItem>
        </Card>
        <AppFooter/>
      </View>
    );
  }
}

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
  card:{
      flexDirection: 'row',
      justifyContent: 'center',
      marginLeft: '5%',
      marginRight: '5%',
      maxWidth: '100%'
  }
});
