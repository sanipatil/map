import Realm from 'realm';

class MarkersData extends Realm.Object{}
MarkersData.schema = {
    name: 'MarkersData',
    properties: {
        id: {type: 'int',   default: 0},
        bearing: {type: 'float', default: 0.0},
        tid: {type: 'int',   default: 0},
        targetlat: {type: 'float', default: 0.0},
        targetlng: {type: 'float', default: 0.0},
        sid: {type: 'int',   default: 0},
        sourcelat: {type: 'float', default: 0.0},
        sourcelng: {type: 'float', default: 0.0},
    }
}; 

class PolygonData extends Realm.Object{}
PolygonData.schema = {
    name: 'PolygonData',
    properties: {
        id: {type: 'int',   default: 0},
        lat: {type: 'float', default: 0.0},
        lng: {type: 'float', default: 0.0}
    }
};

export default new Realm({schema: [MarkersData, PolygonData], schemaVersion: 1});