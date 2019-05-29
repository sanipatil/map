import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, TextInput} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import RetroMapStyles from './MapStyles/RetroMapStyles.json';
import renderIf from 'render-if';


const BRNG = 0;
const LATITUDE_B = 8.46696;
const LONGITUDE_B = -17.03663;
const LATITUDE_A = 65.35996;
const LONGITUDE_A = -17.03663;
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
            },
            map_view:[],
            showCard1:false,
            showCard2:false,
            bearing: BRNG,
            distance: 0
        }
    }

    componentWillMount(){
        //console.warn("test")
        let map_data = [];
        map_data.push(
        
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
                title='A'
                draggable>
            </Marker>
            <Marker
                coordinate={this.state.B}
                onDragEnd={(e) => {this.dragMarkerB(e)}}
                title='B'
                draggable>
            </Marker>
            <MapView.Polyline 
                coordinates={[
                    {latitude: this.state.A.latitude, longitude: this.state.A.longitude},
                    {latitude: this.state.B.latitude, longitude: this.state.B.longitude}
                ]}>
            </MapView.Polyline>
        </MapView>
        )
        this.setState({map_view: map_data});
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
        }, ()=>{
            this.bearingEvent(this.state.A,this.state.B);
        })   
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
        }, ()=>{
            this.bearingEvent(this.state.A,this.state.B);
        })
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
        this.setState({bearing: brng})
        this.componentWillMount();
    }

    changeCoordinates = () => {
        let temp_lat1 = parseFloat(this.state.temp_lat1);
        let temp_long1 = parseFloat(this.state.temp_long1);
        let temp_lat2 = parseFloat(this.state.temp_lat2);
        let temp_long2 = parseFloat(this.state.temp_long2);       
        this.state = {
            A: {
                latitude: temp_lat1,
                longitude: temp_long1,
            },
            B: {
                latitude: temp_lat2,
                longitude: temp_long2,
            },
            map_view:[]
        }
        this.componentWillMount();
    }

    changeBearing = () => {
        let temp_lat2 = parseFloat(this.state.temp_lat2);
        let temp_long2 = parseFloat(this.state.temp_long2); 
        let d = parseFloat(this.state.d);
        let brng = parseFloat(this.state.brng);
        var R = 6371e3;
        let Adist = d/R;
        let temp_lat1 = Math.asin((Math.sin(this.toRadians(temp_lat2)) * Math.cos(this.toRadians(Adist))) + (Math.cos(this.toRadians(temp_lat2)) * Math.sin( this.toRadians(Adist)) * Math.cos(this.toRadians(brng))));
        let temp_long1 = temp_long2 + (Math.atan2(Math.sin(this.toRadians(brng)) * Math.sin(this.toRadians(Adist)) * Math.cos(this.toRadians(temp_lat2)), (Math.cos(this.toRadians(Adist))-(Math.sin(this.toRadians(temp_lat1)) * Math.sin(this.toRadians(temp_lat1))))));
        this.state = {
            A: {
                latitude: temp_lat1,
                longitude: temp_long1,
            },
            B: {
                latitude: temp_lat2,
                longitude: temp_long2,
            },
            map_view: []
        }
        this.componentWillMount();
    
    }

    render() {
        return (
            
            <View style={styles.container}>

                {this.state.map_view}

                {renderIf(this.state.showCard1)(
                    <View style={styles.buttonContainer}>     
                        <View style={styles.textContainer}>
                            <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.A.latitude.toString()}
                                onChangeText={(temp_lat1) => this.setState({temp_lat1})}
                                value={this.state.temp_lat1}
                            />
                        </View>               
                        <View style={styles.textContainer}>
                            <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.A.longitude.toString()}
                                onChangeText={(temp_long1) => this.setState({temp_long1})}
                                value={this.state.temp_long1}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.B.latitude.toString()}
                                onChangeText={(temp_lat2) => this.setState({temp_lat2})}
                                value={this.state.temp_lat2}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TextInput
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.B.longitude.toString()}
                                onChangeText={(temp_long2) => this.setState({temp_long2})}
                                value={this.state.temp_long2}
                            />
                        </View>
                        <View style={styles.Container}>
                            <Button
                                onPress={() => this.changeCoordinates()}
                                title="Submit"
                                style={{height: 40, borderColor: 'gray', borderWidth: 1,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}                       
                            />
                        </View> 
                    </View>
                )}

                {renderIf(this.state.showCard2)(
                    <View style={styles.buttonContainer}>     
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder='Distance(m)'
                                placeholderTextColor='#dbdbdb'
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                //defaultValue={this.state.distance.toString()}
                                onChangeText={(d) => this.setState({d})}
                                value={this.state.d}
                            />
                        </View>               
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder='Bearing(deg)'
                                placeholderTextColor='#dbdbdb'
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                //defaultValue={this.state.bearing.toString()}
                                onChangeText={(brng) => this.setState({brng})}
                                value={this.state.brng}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder='Latitude'
                                placeholderTextColor='#dbdbdb'
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.B.latitude.toString()}
                                onChangeText={(temp_lat2) => this.setState({temp_lat2})}
                                value={this.state.temp_lat2}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder='Longitude'
                                placeholderTextColor='#dbdbdb'
                                style={{height: 40, borderColor: 'gray', borderWidth: 1, color: '#fff'}}
                                defaultValue={this.state.B.longitude.toString()}
                                onChangeText={(temp_long2) => this.setState({temp_long2})}
                                value={this.state.temp_long2}
                            />
                        </View>
                        <View style={styles.Container}>
                            <Button
                                onPress={() => this.changeBearing()}
                                title="Submit"
                                style={{height: 40, borderColor: 'gray', borderWidth: 1,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}                       
                            />
                        </View> 
                    </View>
                )}

                <View style={styles.plotmap}>
                    <TouchableOpacity
                        onPress={() => {this.setState({'showCard1':!this.state.showCard1})}}  
                        style={[styles.bubble, styles.button]}>
                        <Text>LatLng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {this.setState({'showCard2':!this.state.showCard2})}}
                        style={[styles.bubble, styles.button]}>
                        <Text>Bearing Angle</Text>
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
        width:screen.width-50,
        backgroundColor:"rgba(52, 52, 52, 0.6)"
        
    },
    Container: {
        marginVertical:2,
        width:screen.width-50,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        //borderRadius: 20,
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
    }
});