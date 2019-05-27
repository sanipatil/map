import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Share} from 'react-native';

export default class BearingAngle extends Component {

    static navigationOptions = {
        title: 'Home Screen',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3'
    };

    render() {
        return (
            <Text>bearing angle</Text>
        );
    }
}