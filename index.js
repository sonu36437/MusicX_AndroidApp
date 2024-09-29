/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import playerManagement from './global/PlayerMangement';

AppRegistry.registerComponent(appName, () => App);

// Define the playback service
async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => playerManagement.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => playerManagement.skipToPrevious());

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (event) => {
    console.log('Playback active track changed:', event.track);
  });
  
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (event) => {
    console.log('Playback queue ended:', event.track);
    await playerManagement.skipToNext();
  });
}

// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService);

// ... rest of your code