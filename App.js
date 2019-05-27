/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';
import PolygonCreate from './components/PolygonCreate';
import BearingAngle from './components/BearingAngle';

const Navigator = createStackNavigator(
  {HomeScreen, MapScreen, PolygonCreate, BearingAngle},
  {initialRouteName :'HomeScreen'},
);

const App = createAppContainer(Navigator);

export default App;
