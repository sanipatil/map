import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import {BackHandler} from 'react-native';


export default class HomeScreen extends Component {

    static navigationOptions = {
        title: 'Home Screen',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3'
    };

    constructor(props){
        super(props);
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

    GoToMapScreen = () => {
       this.props.navigation.navigate('MapScreen');
    }

    GoToPolygon = () => {
        this.props.navigation.navigate('PolygonCreate');
    }

    GoToBearingAngle = () => {
        this.props.navigation.navigate('BearingAngle');
    }


    render() {
        return (
            <ImageBackground source={require('./res/map.jpg')} style={styles.backgroundImage}>
                <View style={styles.MainContainer}>
                    <TouchableOpacity onPress={this.GoToMapScreen} activeOpacity={0.1} style={styles.button} >
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