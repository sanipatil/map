/**
 * @format
 */
import { Navigation } from "react-native-navigation";
import {registerScreens} from './components/Screens';
//import {AppRegistry} from 'react-native';
//import App from './App';
//import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => App);

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
          stack: {
            children: [
              {
                component: {
                  id: 'HomeScreen',
                  name: 'HomeScreen',
                }
              }
          ],
          options: {},
          }
        }
      })
});


