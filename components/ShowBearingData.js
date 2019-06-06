import React, {Component} from 'react';
import { StyleSheet, View, FlatList, Alert, Dimensions, TouchableOpacity} from 'react-native';
import { BackHandler } from 'react-native';
import realm from './RealmData';
import { Container, Card, CardItem, Body, Button, Text } from 'native-base';

const BRNG = 0;
const LATITUDE_A = 0.00000;
const LONGITUDE_A = 0.00000;
const LATITUDE_B = 30.35996;
const LONGITUDE_B = 0.00000;
const screen = Dimensions.get('window');

export default class ShowBearingData extends Component {

    static navigationOptions = {
        title: 'Bearings List',
        headerStyle: {
           backgroundColor: '#1b3752'
        },
        headerTintColor: '#dce7f3',
    };

    constructor(props) {
        super(props);    
        this.state = {
            dataSource: [],
            src: {
                latitude: LATITUDE_A,
                longitude: LONGITUDE_A,
            },
            B: {
                latitude: LATITUDE_B,
                longitude: LONGITUDE_B,
            },
            Sid: 1,
            Tid: 2,
            map: false,
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

    display = (item) => {    
        this.props.navigation.navigate('BearingAngle', {
            id: item.id,
            tid: item.tid,
            brng: item.bearing,
            target_lat: item.targetlat,
            target_lng: item.targetlng,
            sid: item.sid,
            source_lat: item.sourcelat,
            source_lng: item.sourcelng,
        });
          
    }

    deleteItem = (item) => {
        let delitem = realm.objects('MarkersData').filtered(`id=${item.id}`);
        realm.write(() => {
            realm.delete(delitem);
        })
        Alert.alert('Deleted');
        var data = realm.objects('MarkersData');
        this.setState({
            dataSource: data,
        });
    }

    deleteAll = () => {
        realm.write(() => {
            let allpolygons = realm.objects('MarkersData');
            realm.delete(allpolygons);
        })
        var data = realm.objects('MarkersData');
        this.setState({
            dataSource: data,
        });
    }

    callCard() {
        return (
            <FlatList 
                data={this.state.dataSource}
                renderItem={({item}) => 
                    <Card>
                        <CardItem>    
                            <Body style={{width:'100%'}}>
                                <Text style={styles.textViewContainer}>{'Id: ' + item.id}</Text>
                                <Text style={styles.textViewContainer}>{'Bearing: ' + item.bearing+'°'}</Text>
                                <Text style={styles.textViewContainer}>{'Target Lat: ' + item.targetlat}</Text>
                                <Text style={styles.textViewContainer}>{'Target Lng: ' + item.targetlng}</Text>
                                <Text style={styles.textViewContainer}>{'Source Lat: ' + item.sourcelat}</Text>
                                <Text style={styles.textViewContainer}>{'Source Lng: ' + item.sourcelng}</Text>
                            </Body>
                        </CardItem>
                        <View style={styles.buttonContainer}>
                            <Button transparent success style={styles.button} onPress = {() => this.display(item)}><Text style={{color: 'green'}}>View</Text></Button>
                            <Button transparent success style={styles.button} onPress = {() => this.deleteItem(item)}><Text style={{color: 'green'}}>Delete</Text></Button>
                        </View>
                    </Card>
                }
            />   
        );
    }

    render() {     
        return (
            <Container style={styles.MainContainer}>
                <Text style={styles.textStyle}>Double tap View to Display bearing</Text>
                <View style={{ height: 2, width: "100%", backgroundColor: "#000",}}/>
                {this.callCard()}
                <View style={styles.deleteAllContainer}>
                <Button light style={styles.deleteAllButton} onPress = {() => this.deleteAll()}><Text>Delete All</Text></Button>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex:1,
        margin: 10  
    },   
    textViewContainer: {
        textAlignVertical:'center', 
        fontSize: 18,
    },
    textStyle: {
        alignItems: 'center',
        fontSize: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 1,
        backgroundColor: 'transparent',
    },
    button: {
        alignItems: 'center',
    },
    deleteAllContainer: {
        width:screen.width-20,
        alignItems:'flex-end' 
    },
    deleteAllButton: {
        paddingHorizontal: 12,
        alignItems: 'center',
        width: '100%',
        height: 50,
        padding: 15,
        backgroundColor: '#92b6db',
        justifyContent: 'center',
    }
});