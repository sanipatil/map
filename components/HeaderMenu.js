import React, { Component } from 'react';
import { View, Image, TouchableOpacity} from 'react-native';
import {BackHandler} from 'react-native';
import Menu, { MenuItem} from 'react-native-material-menu';


export default class HeaderMenu extends Component {

    _menu = null;

    constructor(props) {
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
   
    setMenuRef = ref => {
        this._menu = ref;
    };
    showMenu = () => {
        this._menu.show();
    };
    hideMenu = () => {
        this._menu.hide();
    };

    GoToDisplay = () => {
        this._menu.hide();
        this.props.GoToDisplay();
    }

    GoToAlert = () => {
        this._menu.hide();
        this.props.GoToAlert();
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    ref={this.setMenuRef}
                    button={<TouchableOpacity onPress = {this.showMenu}>
                                <Image source={require('./res/options.png')}/>
                            </TouchableOpacity>}
                >
                    <MenuItem onPress={this.GoToDisplay}>Show All Bearings</MenuItem>
                    <MenuItem onPress={this.GoToAlert}>Help</MenuItem>
                </Menu>
            </View>
        );
    }
}