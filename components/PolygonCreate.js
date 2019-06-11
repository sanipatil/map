import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Image, PermissionsAndroid} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import RNFetchBlob from 'react-native-fetch-blob';
import {BackHandler} from 'react-native';
import realm from './RealmData';
import renderIf from 'render-if';
import { Navigation } from 'react-native-navigation';
import shareexport from './ShareExport';


const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id=0;

export default class PolygonCreate extends Component {
  _ismounted = false;
  static get options() {
    return {
      topBar: {
        backButton: { color: '#dce7f3'},
        background: {
            color: '#1b3752',
        },
        title: {
            text: 'Create Polygon',
            color: '#dce7f3',
            fontSize: 20,
            fontFamily: 'Arial',
        },
        rightButtons: [{
          id: 'HeaderButton',
          text: 'Help',
          color: '#dce7f3',
        }]
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      regiongps: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygons: [],
      editing: null,
      creatingHole: false,
      dataSource: [],
      exports: false,
    };

    const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/polygon.csv`;
    RNFetchBlob.fs.unlink(FILE_PATH)
    .then({})
    .catch((error)=> alert(error.message));

    Navigation.events().bindComponent(this);
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }

  componentDidMount() {
    this._ismounted=true;

    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        ).then((result) => {
          if (result['android.permission.ACCESS_COARSE_LOCATION']
          && result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.READ_EXTERNAL_STORAGE']
          && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            this.setState({
              permissionsGranted: true
            });
          } else if (result['android.permission.ACCESS_COARSE_LOCATION']
          || result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.READ_EXTERNAL_STORAGE']
          || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
            this.refs.toast.show('Please Go to Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
          }
        });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.setState({
          regiongps: {
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

    var data = realm.objects('PolygonData');
    this.setState({
      dataSource: data,
    });
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }
  
  componentWillUnmount() {
    this._ismounted=false;
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => {
    Navigation.pop(this.props.componentId);
    return true;
  }
  
  navigationButtonPressed({ buttonId }) {
    const title = 'Create Polygon Help';
    const message = '1. DoubleTap the map to Zoom and mark locations accurately.\n'+'\n2. Press "Save" after creating each polygon to export.\n'+'\n3. Tap the polygon to access "Delete" option.\n'+'\n4. To share polygons saved, press "Share CSV". A "polygon.csv" file can be shared.\n'+'\n5. To delete all polygons, press "Reset All".';
    Alert.alert(title, message);
  }

  onPress() {
    const { editing, creatingHole } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [this.state.region],
          holes: [],
        },
      });
    } else if (!creatingHole) {
        this.setState({
          editing: {
            ...editing,
            coordinates: [...editing.coordinates, this.state.region],
          },
        });
      } else {
          const holes = [...editing.holes];
          holes[holes.length - 1] = [
            ...holes[holes.length - 1],
            this.state.region,
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
      
  onRegionChangeComplete = (region) => {
    this.setState({region})   
  }

  callMap() {

    return (
      <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          <MapView.Marker 
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.regiongps}
            title="My location"
            pinColor={'yellow'}
          />
          
          {this.state.editing && (
            <MapView.Polygon
              key={this.state.editing.coordinates}
              coordinates={this.state.editing.coordinates}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
          {this.state.polygons.map((polygon,i) => (
            <Polygon
              key={i}
              coordinates={polygon.coordinates}
              title={(i).toString()}
              holes={polygon.holes}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
              tappable={true}
              onPress={()=> this.polygonPress(i)}
            />
          ))}
          {this.state.editing && this.state.editing.coordinates &&
            (this.state.editing.coordinates.map((coordinate, index) => (
              <MapView.Marker
                key={index}
                coordinate={coordinate}
              >
              </MapView.Marker>
          )))}
        </MapView>
    );
  }

  polygonPress = (i) => {
    const id = (i).toString();
    const title = `PolygonId: ${id}`;
    const message = '';
    const buttons = [
      {text: 'Delete', onPress: () => this.deletePolygon(i)}
    ]
    Alert.alert(title, message, buttons);
  }

  deletePolygon = (i) => {
    var temp = this.state.polygons.filter((item) => item != this.state.polygons[i]);
    this.setState({
      polygons: temp,
    })

    let poly = realm.objects('PolygonData').filtered(`id=${i}`);
    realm.write(() => {
      realm.delete(poly);
    })
  }

  reset = () => {
    this.setState({
      polygons: [],
      editing: null,
      creatingHole: false,  
      exports: false,  
    })

    realm.write(() => {
      let allpolygons = realm.objects('PolygonData');
      realm.delete(allpolygons);
    })

    const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/polygon.csv`;
    RNFetchBlob.fs.unlink(FILE_PATH)
    .then((
      Alert.alert('Data Reset')
    ))
    .catch((error)=> alert(error.message));
  }

  save = () => {  
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
      creatingHole: false,
    });
    for (i in this.state.editing.coordinates) {    
      realm.write(() => {
        realm.create('PolygonData', {
          id: this.state.editing.id,
          lat: this.state.editing.coordinates[i].latitude,
          lng: this.state.editing.coordinates[i].longitude,
        });
      });
    }
    this.setState({
      exports: true,
    })
    Alert.alert('Data Saved')
  }

  shareData = () => {
    const headerString = 'Polygon id,Latitude,Longitude\n';
    const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/polygon.csv`;
    const csvString = `${headerString}${this.ConvertToCSV(this.state.dataSource)}`;
    shareexport.shareData(FILE_PATH,csvString);
  }

  ConvertToCSV = (objArray) => {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";
    for (var i = 0; i < array.length; i++) {
      str+= array[i]['id']+","+array[i]['lat']+","+array[i]['lng']+"\n";
    }
    return str;
  }

  render() {   
    return (
      <View style={styles.container}>
        {this.callMap()}
        <View style={styles.markerFixed}>
          <TouchableOpacity onPress={()=>this.onPress()}>
            <Image source={require('./res/mark.png')}
              style={{width: 60, height: 60}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.save()}
              style={[styles.bubble, styles.button]}>
              <Text>Save</Text>
            </TouchableOpacity>
          )}
            {renderIf(this.state.exports)(
              <TouchableOpacity
                onPress={() => this.shareData()}
                style={[styles.bubble, styles.button]}>
                <Text>Share CSV</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => this.reset()}
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
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    height: 40,
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
  markerFixed: {
    left: '50%',
    marginLeft: -30,  //-30, //-24,
    marginTop: -30,   //-30, //-48,
    position: 'absolute',
    top: '50%',
    zIndex: 999,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent'
  },
});
