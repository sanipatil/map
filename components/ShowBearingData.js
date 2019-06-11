import React, {Component} from 'react';
import { Platform, StyleSheet, View, FlatList, Text, Alert, Dimensions, PermissionsAndroid} from 'react-native';
import { BackHandler } from 'react-native';
import realm from './RealmData';
import { Container, Card, CardItem, Button} from 'native-base';
import {Navigation} from 'react-native-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import { Table, TableWrapper, Rows} from 'react-native-table-component';
import shareexport from './ShareExport';


const BRNG = 0;
const LATITUDE_A = 0.00000;
const LONGITUDE_A = 0.00000;
const LATITUDE_B = 30.35996;
const LONGITUDE_B = 0.00000;
const screen = Dimensions.get('window');

export default class ShowBearingData extends Component {

    static get options() {
        return {
            topBar: {
                backButton: { color: '#dce7f3'},
                background: {
                    color: '#1b3752',
                },
                title: {
                    text: 'Bearing List',
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

        const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/bearing.csv`;
        RNFetchBlob.fs.unlink(FILE_PATH)
        .then({})
        .catch((error)=> alert(error.message));

        Navigation.events().bindComponent(this);
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillMount() {
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

        var data = realm.objects('MarkersData');
        this.setState({
            dataSource: data,
        });
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    onBack = () => {
        Navigation.popToRoot(this.props.componentId);
        return true;
    }

    navigationButtonPressed({ buttonId }) {
        const title = 'Bearing List Help';
        const message = '1. Press "View" to view the bearing on map.\n'+'\n2. To delete individual bearing press "Delete".\n'+'\n3. To view bearing recently edited press "Sync".\n'+'\n4. To delete all saved bearings select the "Delete All" option.\n'+'\n5. To share bearings saved, press "Share". A "bearing.csv" file can be shared.';
        Alert.alert(title, message);
    }
   
    FlatListItemSeparator = () => {
        return(
          <View style={{ height: 2, width: "100%", backgroundColor: "#000",}}/>
        );
    }

    display = (item) => {    
        Navigation.push(this.props.componentId, {
            component: {
                 id: 'ViewBearing',
                 name: 'ViewBearing',
                 passProps: {
                    mapValue: true,
                    id: item.id,
                    tid: item.tid,
                    brng: item.bearing,
                    target_lat: item.targetlat,
                    target_lng: item.targetlng,
                    sid: item.sid,
                    source_lat: item.sourcelat,
                    source_lng: item.sourcelng,
                 },
                 options: {},                
            },
        })
          
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

    sync = () => {
        var data = realm.objects('MarkersData');
        this.setState({
            dataSource: data,
        });
    }

    shareAll = () => {
        const headerString = 'Id,Bearing °,TargetLat,TargetLng,SourceLat,SourceLng\n';
        const FILE_PATH = `${RNFetchBlob.fs.dirs.DownloadDir}/bearing.csv`;
        const csvString = `${headerString}${this.ConvertToCSV(this.state.dataSource)}`;
        shareexport.shareData(FILE_PATH,csvString);
    }

    ConvertToCSV = (objArray) => {
        var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
        var str = "";
        for (var i = 0; i < array.length; i++) {
          str+= array[i]['id']+","+array[i]['bearing']+","+array[i]['targetlat']+","+array[i]['targetlng']+","+array[i]['sourcelat']+","+array[i]['sourcelng']+"\n";
        }
        return str;
    }

    callCard() {
        return (
            <FlatList 
                data={this.state.dataSource}
                renderItem={({item}) => 
                    <Card>
                        <CardItem>    
                            <View style={{flex: 1, padding: 2}}>
                                <Table borderStyle={{borderWidth: 1, borderColor: '#d1d1d1'}}>
                                    <TableWrapper style={styles.wrapper}>
                                    <Rows data={[   ['Id',`${item.id}`],
                                                    ['Bearing',`${item.bearing}°`],
                                                    ['Target Lat',`${item.targetlat}`],
                                                    ['Target Lng',`${item.targetlng}`],
                                                    ['Source Lat',`${item.sourcelat}`],
                                                    ['Source Lng',`${item.sourcelng}`]
                                                ]} flexArr={[1,2]} style={{height: 35}} textStyle={{color: '#000', padding: 10,  fontSize: 15}}>
                                    </Rows>
                                    </TableWrapper>
                                </Table>
                            </View>
                        </CardItem>
                        <View style={styles.buttonContainer}>
                            <Button light style={styles.button} onPress = {() => this.display(item)}><Text style={{color: 'green'}}>View</Text></Button>
                            <Button light style={styles.button} onPress = {() => this.deleteItem(item)}><Text style={{color: 'green'}}>Delete</Text></Button>
                        </View>
                    </Card>
                }
            /> 
        );
    }

    render() {     
        return (
            <Container style={styles.MainContainer}>
                {this.callCard()}
                <View style={styles.allContainer}>
                    <Button light style={styles.allButton} onPress = {() => this.sync()}><Text>Sync</Text></Button>
                    <Button light style={styles.allButton} onPress = {() => this.deleteAll()}><Text>Delete All</Text></Button>
                    <Button light style={styles.allButton} onPress = {() => this.shareAll()}><Text>Share</Text></Button>
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
    buttonContainer: {
        flexDirection: 'row',
        
        backgroundColor: 'transparent',
        marginHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        width:90,
        padding: 5,
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    allContainer: {
        flexDirection: 'row',
        alignItems:'flex-end',  
    },
    allButton: {
        alignItems: 'center',
        width: 110,
        height: 50,
        padding: 5,
        backgroundColor: '#92b6db',
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    wrapper: {
        flexDirection: 'row'
    },
});