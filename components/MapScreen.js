import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Share, Alert, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {BackHandler} from 'react-native';
import HeaderCommon from './HeaderCommon';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class MapScreen extends Component {
  _ismounted = false;
  
  static navigationOptions = {
    title: 'Map Coordinates',
    headerStyle: {
      backgroundColor: '#1b3752'
    },
    headerTintColor: '#dce7f3',
    headerRight: (
      <HeaderCommon
          GoToAlert = {() => {
              const title = 'Map Coordinates Help';
              const message = '1. DoubleTap the map to Zoom and mark locations accurately.\n'+'\n2. Tap the marker to View Latitude, Longitude, Share and Delete the marker.\n'+'\n3. To share all points marked press "Share All Points".\n'+'\n4. To remove all marked points press "Reset All".';
              Alert.alert(title, message);
          }}
      />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      coordinate: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: []
    };
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {
    this._ismounted=false;
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => {
    return this.props.onBack();
  }

  componentDidMount() {
    this._ismounted=true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.setState({
          coordinate: {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        })
      },
      (error) => {
        console.warn('error in getting coordinates',error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 100}
    );
  }


  addMarker() {  
    if(this._ismounted) {
      this.setState({
        markers: [...this.state.markers,
          {
            latlng: {
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude
            }
          }
        ]
     })
    }
  }

  shareCoordinates = () => {
    var temp = [];
    for(var i = 0; i<this.state.markers.length;i++) {
      temp+= JSON.stringify(this.state.markers[i].latlng);
    }
    var message = `${temp}`;
    Share.share({
      message: message
    }).then(result=>console.log(result).catch(errorMsg=>console.log(errorMsg)));
  }

  displayLatlng = (i) => {
    var temp1  = JSON.stringify(this.state.markers[i].latlng.latitude);
    var temp2 = JSON.stringify(this.state.markers[i].latlng.longitude);
    const title = `LatLng of Marker: ${i+1}`;
    const message = `Latitude: ${temp1} Longitude: ${temp2}`;
    Alert.alert(title, message);
  }

  shareMarker = (i) => {
    var temp1  = JSON.stringify(this.state.markers[i].latlng.latitude);
    var temp2 = JSON.stringify(this.state.markers[i].latlng.longitude);
    Share.share({
      message: `Latitude: ${temp1} Longitude: ${temp2}`
    }).then(result=>console.log(result).catch(errorMsg=>console.log(errorMsg)));
  }

  deleteMarker = (i) => {
    var temp = this.state.markers.filter((item) => item != this.state.markers[i]);
    this.setState({
      markers: temp
    })
  }
 
  onMarkerPress(i) {
    const id = (i+1).toString();
    const title = `MarkerId: ${id}`;
    const message = 'Operations on marker';
    const buttons = [
      {text: 'Share', onPress: () => this.shareMarker(i)},
      {text: 'Delete Marker', onPress: () => this.deleteMarker(i)},
      {text: 'Display LatLng', onPress: () => this.displayLatlng(i)}
    ]
    Alert.alert(title, message, buttons);
  }

  onRegionChangeComplete = (region) => {
    this.setState({region})   
  }

  callMap() {
    return(
      <MapView
          ref={(mapView)=>{ _mapView = mapView;}}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          <Marker 
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
            title="My location"
            pinColor={'yellow'}
          />
          {this.state.markers.map((marker,i)=>(
              <Marker 
                key={i}
                coordinate={marker.latlng}
                title={(i+1).toString()}
                onPress={()=> this.onMarkerPress(i)}
              />
            ))
          }
        </MapView>
    );
  }
  
  reset = () => {
    this.setState({
      markers: []
    })
    Alert.alert('Data Reset')
  }

  render() {
    return (
      <View style={styles.container}>
        {this.callMap()}
        <View style={styles.markerFixed}>
          <TouchableOpacity onPress={()=>this.addMarker()}>
            <Image source={require('./res/mark.png')}
              style={{width: 60, height: 60}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={()=>this.shareCoordinates()}
              style={[styles.bubble, styles.button]}>
              <Text>Share All Points</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>this.reset()}
              style={[styles.bubble, styles.button]}>
              <Text>Reset All</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
   ...StyleSheet.absoluteFillObject
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    height: 50,
    width: '40%',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  markerFixed: {
    left: '50%',
    marginLeft: -30, 
    marginTop: -30,  
    position: 'absolute',
    top: '50%',
    zIndex: 999,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent'
},
});
  

   