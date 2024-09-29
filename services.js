import TrackPlayer from 'react-native-track-player';
import playerManagement from "./global/PlayerMangement"
module.exports = async function () {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-next', () =>playerManagement.skipToNext() );
    TrackPlayer.addEventListener('remote-previous', () => playerManagement.skipToNext());
};