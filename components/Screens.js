import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('HomeScreen', () => require('./HomeScreen').default);
  Navigation.registerComponent('MapScreen', () => require('./MapScreen').default);
  Navigation.registerComponent('PolygonCreate', () => require('./PolygonCreate').default);
  Navigation.registerComponent('BearingAngle', () => require('./BearingAngle').default);
  Navigation.registerComponent('ShowBearingData', () => require('./ShowBearingData').default);
  Navigation.registerComponent('ViewBearing', () => require('./ViewBearing').default);
}