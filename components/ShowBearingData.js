import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import {BackHandler} from 'react-native';
import realm from './RealmData';


export default class ShowBearingData extends Component {

    static navigationOptions = {
        title: 'Bearing Angles',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3'
    };

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        };
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillMount() {
        var data = realm.objects('MarkersData');
        this.setState({
            dataSource: data,
        });
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        return this.props.onBack();
    }

    FlatListItemSeparator = () => {
        return(
          <View style={{ height: 2, width: "100%", backgroundColor: "#000",}}/>
        );
    }

    render() {        
        return (
            <View style={styles.MainContainer}>
                <FlatList
                    data={this.state.dataSource}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({item}) => 
                        <View>
                            <Text style={styles.textViewContainer}>{'Id = ' + item.id}</Text>
                            <Text style={styles.textViewContainer}>{'Bearing = ' + item.bearing}</Text>
                            <Text style={styles.textViewContainer}>{'Target Lat = ' + item.targetlat}</Text>
                            <Text style={styles.textViewContainer}>{'Target Lng = ' + item.targetlng}</Text>
                            <Text style={styles.textViewContainer}>{'Source Lat = ' + item.sourcelat}</Text>
                            <Text style={styles.textViewContainer}>{'Source Lng = ' + item.sourcelng}</Text>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex:1,
        justifyContent: 'center',
        paddingTop: (Platform.OS) === 'android' ? 20 : 0,
        margin: 10  
    },   
    textViewContainer: {
        textAlignVertical:'center', 
        padding:10,
        fontSize: 20,
    }
});