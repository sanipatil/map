import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, TextInput, Alert, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import renderIf from 'render-if';
import {BackHandler} from 'react-native';
import realm from './RealmData';
import HeaderMenu from './HeaderMenu';


const BRNG = 0;
const LATITUDE_A = 0.00000;
const LONGITUDE_A = 0.00000;
const LATITUDE_B = 30.35996;
const LONGITUDE_B = 0.00000;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class BearingAngle extends Component {

    static navigationOptions = ({navigation}) => {

        return {
            title: 'Bearing Angle',
            headerStyle: {
                backgroundColor: '#1b3752'
            },
            headerTintColor: '#dce7f3',
            headerRight: (
                <HeaderMenu
                    GoToDisplay = {() => {
                        navigation.navigate('ShowBearingData');
                    }}
                    GoToAlert = {() => {
                        const title = 'Bearing Angle Help';
                        const message = '1.DoubleTap to zoom map and mark locations accurately.\n'+'\n2. Click on the marker to access options: Move to GPS and Edit Manually.\n'+'\n3. To Show all bearings click the menu option in the header.';
                        Alert.alert(title, message);
                    }}
                />
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            src: {
                latitude: LATITUDE_A,
                longitude: LONGITUDE_A,
            },
            B: {
                latitude: LATITUDE_B,
                longitude: LONGITUDE_B,
            },
            region: {
                latitude: LATITUDE_B,
                longitude: LONGITUDE_B,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            accuracy: 0,
            bearing: BRNG,
            gpsmarker: false,
            manualmarker: false,
            Sid: 1,
            Tid: 2,
        };
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }
    
    onBack = () => {
        return this.props.onBack();
    }

    callMap() {
        
        return(
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                onRegionChangeComplete={this.onRegionChangeComplete}
                >
                <Marker
                    coordinate={this.state.src}
                    key={this.state.Sid}
                    title={'Source '+(this.state.Sid).toString()}
                    onPress={(e)=>{this.onMarkerPress(this.state.Sid)}}
                    //anchor={{x: 0.5,y:0.5}}   // places polyline to the center of the target icon
                >
                </Marker>
                <Marker
                    coordinate={this.state.B}
                    title={'Target '+(this.state.Tid).toString()}
                    onPress={(e)=>{this.onMarkerPress(this.state.Tid)}}
                >
                </Marker>
                <MapView.Polyline 
                    coordinates={[
                        {latitude: this.state.src.latitude, longitude: this.state.src.longitude},
                        {latitude: this.state.B.latitude, longitude: this.state.B.longitude}
                    ]}
                    style={{marginTop: 30}}
                    >
                </MapView.Polyline>
            </MapView>
        );
    }

    onRegionChangeComplete = (region) => {
        this.setState({region})   
    }

    onMarkerPress(id) {
        const title = 'Bearing Operations';
        const message = `Marker Id: ${id}`;
        const buttons = [
            {text: 'Move To GPS', onPress: () => this.mylocation(id)},
            {text: 'Edit Manually', onPress: () => this.mark(id)},
        ]
        Alert.alert(title, message, buttons);
    }

    mylocation = (id) => {
        if(id == 1) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        src: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        accuracy: position.coords.accuracy,
                        gpsmarker: true,
                        manualmarker: false,
                    }, ()=>{
                        this.bearingEvent(this.state.src,this.state.B); 
                    })
                },
                (error) => {
                console.warn('error in getting coordinates',error.message);
                },
                {enableHighAccuracy: false, timeout: 15000, maximumAge: 100}
            );
        }
        else if(id == 2) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        B: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        },
                        accuracy: position.coords.accuracy,
                        gpsmarker: true,
                        manualmarker: false,
                    }, ()=>{
                        this.bearingEvent(this.state.src,this.state.B); 
                    })
                },
                (error) => {
                console.warn('error in getting coordinates',error.message);
                },
                {enableHighAccuracy: false, timeout: 15000, maximumAge: 100}
            );
        }
    }

    mark = (id) => {
        this.setState({
            manualmarker:true,
            'index': id,
            gpsmarker: false,
        })
    }
    markPoint = (id) => {
        //console.warn(this.state.region);
        if (id == 1) {
            let latitude = this.state.region.latitude;
            let longitude = this.state.region.longitude;
            let latitude_b = this.state.B.latitude;
            let longitude_b = this.state.B.longitude;
            this.setState({
                src: {
                    latitude: latitude,
                    longitude: longitude
                },
                B: {
                    latitude: latitude_b,
                    longitude: longitude_b
                }
            }, ()=>{
                this.bearingEvent(this.state.src,this.state.B); 
            })   
        } 
        else if (id == 2) {
            let latitude_a = this.state.src.latitude;
            let longitude_a = this.state.src.longitude;
            let latitude = this.state.region.latitude;
            let longitude = this.state.region.longitude;
            this.setState({
                src: {
                    latitude: latitude_a,
                    longitude: longitude_a
                },
                B: {
                    latitude: latitude,
                    longitude: longitude
                }
            }, ()=>{
            this.bearingEvent(this.state.src,this.state.B);
            })
        }
    }

    toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    bearingEvent(src, B) {
        let lat_a = src.latitude;
        let lng_a = src.longitude;
        let lat_b = B.latitude;
        let lng_b = B.longitude;
        let y = Math.sin(this.toRadians(lng_b-lng_a)) * Math.cos(this.toRadians(lat_b));
        let x = (Math.cos(this.toRadians(lat_a)) * Math.sin(this.toRadians(lat_b))) - (Math.sin(this.toRadians(lat_a)) * Math.cos(this.toRadians(lat_b)) * Math.cos(this.toRadians(lng_b-lng_a)));
        let brng = Math.atan2(y,x);
        brng = this.toDegrees(brng);
        realm.write(() => {
            var Id = realm.objects('MarkersData').length+1;
            realm.create('MarkersData',{
                id: Id,
                bearing: brng,
                targetlat: this.state.B.latitude,
                targetlng: this.state.B.longitude,
                sourcelat: this.state.src.latitude,
                sourcelng: this.state.src.longitude,
            });
        });
        this.setState({
            bearing: brng
        });
        this.callMap();
    }

    render() {
        return (
            <View style={styles.container}>
                {this.callMap()} 
                {renderIf(this.state.manualmarker)(
                    <View style={styles.markerFixed}>
                        <TouchableOpacity onPress={()=>this.markPoint(this.state.index)}>
                            <Image source={require('./res/mark.png')}
                                    style={{width: 60, height: 60}}
                            />
                        </TouchableOpacity>
                    </View>
                )}  
                <View style={styles.textContainer}>
                    <Text>Bearing: {this.state.bearing}</Text>
                    <Text>Target LatLng: {this.state.B.latitude}, {this.state.B.longitude}</Text>
                    <Text>Source LatLng: {this.state.src.latitude}, {this.state.src.longitude}</Text>
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
    TextInputStyle: {
        borderWidth: 1,
        borderColor: '#009688',
        width: '40%',
        height: 40,
        borderRadius: 10,
        marginBottom: 10,   
    },
    buttonContainer: {
        flexDirection: 'column',
        marginVertical: 20,
        width:screen.width-50,
        alignItems:'flex-end'  
    },
    textContainer: {
        marginVertical:2,
        width:screen.width-100,
        height: 100,
        backgroundColor:"rgba(255, 255, 277, 0.8)",
        marginBottom: 20,
        padding: 10,
    },
    Container: {
        flexDirection: 'row',
        marginVertical:2,
        width:screen.width-50,
        alignItems: 'center',
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    plotmap: {
        flexDirection: 'row',
        marginVertical: 20,
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