/**
 * @format
 */

// react-native-gesture-handler imported as a peer dependency
// of @react-navigation/stack, see documentation:
// https://reactnavigation.org/docs/stack-navigator
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
