import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import RetroMapStyles from './MapStyles/RetroMapStyles.json';


const LATITUDE_A = 8.46696;
const LONGITUDE_A = -17.03663;
const LATITUDE_B = 65.35996;
const LONGITUDE_B = -17.03663;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class BearingAngle extends Component {

    static navigationOptions = {
        title: 'Bearing Angle',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3'
    };

    constructor(props) {
        super(props);
        this.state = {
            A: {
                latitude: LATITUDE_A,
                longitude: LONGITUDE_A,
            },
            B: {
                latitude: LATITUDE_B,
                longitude: LONGITUDE_B,
            }
        }
    }

    dragMarkerA(e) {
        let latitude = e.nativeEvent.coordinate.latitude;
        let longitude = e.nativeEvent.coordinate.longitude;
        let latitude_b = this.state.B.latitude;
        let longitude_b = this.state.B.longitude;
        this.setState({
            A: {
                latitude: latitude,
                longitude: longitude
            },
            B: {
                latitude: latitude_b,
                longitude: longitude_b
            }
        })
        this.bearingEvent(this.state.A,this.state.B);
    }

    dragMarkerB(e) {
        let latitude = e.nativeEvent.coordinate.latitude;
        let longitude = e.nativeEvent.coordinate.longitude;
        let latitude_a = this.state.A.latitude;
        let longitude_a = this.state.A.longitude;
        this.setState({
            A: {
                latitude: latitude_a,
                longitude: longitude_a
            },
            B: {
                latitude: latitude,
                longitude: longitude
            }
        })
        this.bearingEvent(this.state.A,this.state.B);
    }

    toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    bearingEvent(A, B) {
        let lat_a = A.latitude;
        let lng_a = A.longitude;
        let lat_b = B.latitude;
        let lng_b = B.longitude;
        let y = Math.sin(this.toRadians(lng_b-lng_a)) * Math.cos(this.toRadians(lat_b));
        let x = (Math.cos(this.toRadians(lat_a)) * Math.sin(this.toRadians(lat_b))) - (Math.sin(this.toRadians(lat_a)) * Math.cos(this.toRadians(lat_b)) * Math.cos(this.toRadians(lng_b-lng_a)));
        let brng = Math.atan2(y,x);
        brng = this.toDegrees(brng);
        //console.warn(brng);
    }

    updateText(text) {
        const latitude = JSON.stringify(text);
        this.setState({
            A: {latitude: latitude}
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    customMapStyle={RetroMapStyles}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                    >
                    <Marker
                        coordinate={this.state.A}
                        onDragEnd={(e) => {this.dragMarkerA(e)}}
                        draggable>
                    </Marker>
                    <Marker
                        coordinate={this.state.B}
                        onDragEnd={(e) => {this.dragMarkerB(e)}}
                        draggable>
                    </Marker>
                    <MapView.Polyline 
                        coordinates={[
                            {latitude: this.state.A.latitude, longitude: this.state.A.longitude},
                            {latitude: this.state.B.latitude, longitude: this.state.B.longitude}
                        ]}>
                    </MapView.Polyline>
                </MapView>
                {/*<View style={styles.buttonContainer}>
                    <TextInput
                        style = { styles.TextInputStyle } 
                        value={this.state.A.latitude.toString()}
                        onChangeText = {(text) => {this.updateText(text)}} 
                    />
                    </View>*/}
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
    TextInputStyle:
      {
        borderWidth: 1,
        borderColor: '#009688',
        width: '40%',
        height: 40,
        borderRadius: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
      },
});