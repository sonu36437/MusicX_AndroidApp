/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(()=> require("./services"));

TrackPlayer.addEventListener('playback-active-track-changed', (event) => {


    // console.log('Playback active track changed:', event.track);
  });
  
  TrackPlayer.addEventListener('playback-queue-ended', (event) => {
    console.log('Playback queue ended:', event.track);
  });