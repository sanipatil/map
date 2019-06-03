import Realm from 'realm';

class MarkersData extends Realm.Object{}
MarkersData.schema = {
    name: 'MarkersData',
    properties: {
        id: {type: 'int',   default: 0},
        bearing: {type: 'float', default: 0.0},
        targetlat: {type: 'float', default: 0.0},
        targetlng: {type: 'float', default: 0.0},
        sourcelat: {type: 'float', default: 0.0},
        sourcelng: {type: 'float', default: 0.0},
    }
};

export default new Realm({schema: [MarkersData], schemaVersion: 1});