import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import RetroMapStyles from './MapStyles/RetroMapStyles.json';
import RNFetchBlob from 'react-native-fetch-blob';
//import DialogInput from 'react-native-dialog-input';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id=0;

export default class PolygonCreate extends Component {
  _ismounted = false;

  static navigationOptions = {
    title: 'Create Polygon',
    headerStyle: {
      backgroundColor: '#1b3752'
    },
    headerTintColor: '#dce7f3'
  };

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygons: [],
      editing: null,
      creatingHole: false,
    };
  }

  componentDidMount() {
    this._ismounted=true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.setState({
          region: {
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
        this.marker._component.animateMarkerToCoordinate(this.state.region, 500);
      }
    }
  }
  
  componentWillUnmount() {
    this._ismounted=false;
  }

  finish() {
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
      creatingHole: false,
    });
    //console.warn(this.state.polygons);
    console.warn(this.state.editing.coordinates);
    //console.warn(this.state.region);
  }
    
  createHole() {
    const { editing, creatingHole } = this.state;
    if (!creatingHole) {
      this.setState({
        creatingHole: true,
        editing: {
          ...editing,
          holes: [...editing.holes, []],
        },
      });
    } else {
        const holes = [...editing.holes];
        if (holes[holes.length - 1].length === 0) {
          holes.pop();
          this.setState({
            editing: {
              ...editing,
              holes,
            },
          });
        }
        this.setState({ creatingHole: false });
      }
  }
    
  onPress(e) {
    const { editing, creatingHole } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
          holes: [],
        },
      });
    } else if (!creatingHole) {
        this.setState({
          editing: {
            ...editing,
            coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
          },
        });
      } else {
          const holes = [...editing.holes];
          holes[holes.length - 1] = [
            ...holes[holes.length - 1],
            e.nativeEvent.coordinate,
          ];
          this.setState({
            editing: {
              ...editing,
              id: id++, 
              coordinates: [...editing.coordinates],
              holes,
            },
          });
        }
  }

  changeCoordinate(e, index) {
    let newCoord = e.nativeEvent.coordinate;
    let newEditing = Object.assign({},this.state.editing);
    let newCoordinates = Object.assign({},newEditing.coordinates);
    newCoordinates[index] = newCoord;
    newEditing.coordinates = newCoordinates;
    let transformedCoords = Object.keys(newEditing.coordinates).map(function (key) { return newEditing.coordinates[key]; });
    newEditing.coordinates = transformedCoords;
    this.setState({
      editing: newEditing
    })
  }
      
  exportData = () => {
    const headerString = 'event,timestamp\n';
    const rowString = this.state.editing.coordinates.map((l) => `${l[0]},${l[1]}\n` ).join('');
    const csvString = `${headerString}${rowString}`;

    const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/polygon.csv`;
    RNFetchBlob.fs
      .writeFile(pathToWrite,csvString,'utf8')
      .then(Alert.alert('File Exported'))
      .catch(error=>console.warn(error.message));
  }

  render() {   
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={RetroMapStyles}
          region={this.state.region}
          onPress={e => this.onPress(e)}>
          <MapView.Marker 
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.region}
            image={require('./res/myloc.png')}
          />
          {this.state.polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              holes={polygon.holes}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          ))}
          {this.state.editing && (
            <Polygon
              key={this.state.editing.id}
              coordinates={this.state.editing.coordinates}
              holes={this.state.editing.holes}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
          {this.state.editing && (
            <MapView.Polygon
              key={this.state.editing.coordinates}
              coordinates={this.state.editing.coordinates}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
          {this.state.editing && this.state.editing.coordinates &&
            (this.state.editing.coordinates.map((coordinate, index) => (
              <MapView.Marker
                key={index}
                coordinate={coordinate}
               // anchor={{ x: 0.5, y: 0.5 }}
                onPress={(e) => this.changeCoordinate(e, index)}>
              </MapView.Marker>
          )))}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}>
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.exportData()}
              style={[styles.bubble, styles.button]}>
              <Text>Export To CSV</Text>
            </TouchableOpacity>
          )}
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
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
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
    height: 40,
    width: '40%',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
});