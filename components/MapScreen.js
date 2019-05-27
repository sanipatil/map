import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Share} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import RetroMapStyles from './MapStyles/RetroMapStyles.json';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var filepath = 'C:\Users\SANIKA\Projects\react_native\map';

export default class MapScreen extends Component {
  _ismounted = false;
  
  static navigationOptions = {
    title: 'Map Screen',
    headerStyle: {
      backgroundColor: '#1b3752'
    },
    headerTintColor: '#dce7f3'
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
      markers: []
    };
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
        //console.warn(position)
      },
      (error) => {
        console.warn('error in getting coordinates',error.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 100}
    );
  
    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(this.state.coordinate, 500);
      }
    }
  }

  componentWillUnmount() {
    this._ismounted=false;
  }

  addMarker(coordinates) {
    //console.warn(coordinates);    
    if(this._ismounted) {
      this.setState({
        markers: [...this.state.markers,
          {latlng: coordinates}
        ]
     })
    }
  }

  shareCoordinates = () => {
    console.warn(this.state.markers.latlng);
    var temp  = JSON.stringify(this.state.markers)
    Share.share({
      message: temp
    }).then(result=>console.log(result).catch(errorMsg=>console.log(errorMsg)));
    
  }
  
  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(mapView)=>{ _mapView = mapView;}}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={RetroMapStyles}
          region={this.state.coordinate}
          onPress={(e)=>this.addMarker(e.nativeEvent.coordinate)}>
          <Marker 
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
            image={require('./res/myloc.png')}
          />
          {this.state.markers.map((marker,i)=>(
              <Marker 
                key={i}
                coordinate={marker.latlng}
              />
            ))
          }
        </MapView>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={()=>this.shareCoordinates()}
              style={[styles.bubble, styles.button]}>
              <Text>Share Marked Points</Text>
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
  

   