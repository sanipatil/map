import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import {BackHandler} from 'react-native';
import {Navigation} from 'react-native-navigation';

export default class HomeScreen extends Component {

    /*static navigationOptions = {
        title: 'Home Screen',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3'
    };*/

    static get options() {
        return {
            topBar: {
                background: {
                    color: '#1b3752',
                },
                title: {
                    text: 'Home Screen',
                    color: '#dce7f3',
                    fontSize: 20,
                    fontFamily: 'Arial',
                },
            }
        };
    }

    constructor(props){
        super(props);
    }

    GoToMapScreen = () => {
       Navigation.push(this.props.componentId, {
           component: {
                id: 'MapScreen',
                name: 'MapScreen',
                passProps: {},
                options: {},                
           },
       })
    }

    GoToPolygon = () => {
       Navigation.push(this.props.componentId, {
        component: {
             id: 'PolygonCreate',
             name: 'PolygonCreate',
             passProps: {},
             options: {},                
        },
    })
    }

    GoToBearingAngle = () => {
       Navigation.push(this.props.componentId, {
        component: {
             id: 'BearingAngle',
             name: 'BearingAngle',
             passProps: {},
             options: {},                
        },
    })
    }


    render() {
        return (
            <ImageBackground source={require('./res/map.jpg')} style={styles.backgroundImage}>
                <View style={styles.MainContainer}>
                    <TouchableOpacity onPress={()=>this.GoToMapScreen()} activeOpacity={0.1} style={styles.button} >
                        <Text style={styles.TextStyle}> MAP COORDINATES </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.GoToPolygon} activeOpacity={0.1} style={styles.button} >
                        <Text style={styles.TextStyle}> CREATE POLYGON </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.GoToBearingAngle} activeOpacity={0.1} style={styles.button} >
                        <Text style={styles.TextStyle}> BEARING ANGLE </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS) === 'android' ? 20 : 0,
        margin: 10
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    button: {
        width: '100%',
        height: 50,
        padding: 15,
        backgroundColor: '#92b6db',
        borderRadius:7,
        marginTop: 10
    },
    TextStyle: {
        color:'#122335',
        textAlign:'center',
        fontSize: 17,
        fontWeight: 'bold'
    }
});