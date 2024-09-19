import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerContext';

export default function Player() {
  const { currentTrack, skipToNext, playPreviousTrack, pauseTrack, resumeTrack, isPlaying, setIsPlaying, favTracks,
    searchTracks,
    playlistTracks } = usePlayerContext();
  const playbackState = usePlaybackState();
  const progress= useProgress(); 
  
  const [showFullScreen, setShowFullScreen] = useState(false); 
  const [volume, setVolume] = useState(0.5); 

useEffect(()=>{

    if(progress.position>progress.duration){
      console.log("playing next track");
      async function moveNext(){
        await skipToNext();
      }
      moveNext();
    }

},[progress.position])


 

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pauseTrack();
    } else {
      await resumeTrack();
    }
  };

  useEffect(() => {console.log(playbackState.state)},[playbackState])
  // Seek functionality to move the track position
  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };


  // Adjust volume
  const handleVolumeChange = async (value) => {
    setVolume(value);
    await TrackPlayer.setVolume(value);
  };

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

   
  return (
    <>

      {currentTrack && !showFullScreen && (
        <TouchableOpacity style={styles.container} onPress={toggleFullScreen}>
          <Image source={{ uri: currentTrack?.artwork }} style={styles.artwork} />
          <View style={styles.trackInfo}>
            <Text style={styles.title}>{currentTrack?.title || 'Unknown Title'}</Text>
            <Text style={styles.artist}>{currentTrack?.artists || 'Unknown Artist'}</Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPreviousTrack}>
              <Ionicons name="play-skip-back" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons name="play-skip-forward" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Full-Screen Player */}
      {currentTrack && (
        
        <Modal visible={showFullScreen} animationType="slide" transparent={true}>
        
          <View style={styles.fullScreenContainer}>
            <TouchableOpacity onPress={toggleFullScreen} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>

            <Image source={{ uri: currentTrack?.artwork }} style={styles.fullArtwork} />
            <Text style={styles.fullTitle}>{currentTrack?.title || 'Unknown Title'}</Text>
            <Text style={styles.fullArtist}>{currentTrack?.artists || 'Unknown Artist'}</Text>
            
            <Slider
              style={styles.slider}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="white"
              maximumTrackTintColor="white"
              thumbTintColor="#1DB954"
            />
            <View style={styles.progressContainer}>
              <Text style={styles.time}>{new Date(progress.position * 1000).toISOString().substr(14, 5)}</Text>
              <Text style={styles.time}>{new Date(progress.duration * 1000).toISOString().substr(14, 5)}</Text>
            </View>

           

            <View style={styles.fullControls}>
              <TouchableOpacity onPress={playPreviousTrack}>
                <Ionicons name="play-skip-back" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext}>
                <Ionicons name="play-skip-forward" size={40} color="white" />
              </TouchableOpacity>
            </View>
             {/* Volume Slider */}
             {/* <Text style={styles.volumeLabel}>Volume</Text> */}
             <View style={styles.volumeSliderContainer}>
                <Ionicons name='volume-high' size={30} color='white'/>
                <Slider
              style={styles.volumeSlider}
              value={volume}
              minimumValue={0}
              maximumValue={1}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#000000"
              thumbTintColor="#1DB954"
            />
        
            
            </View>
          </View>
          
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Compact player styles
  container: {
    backgroundColor: 'black',
    flexDirection: 'row',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    bottom: '8%',
    width: '100%',
    shadowColor: 'grey',

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontFamily: 'Outfit-Bold',

    fontSize: 16,
  
  },
  artist: {
    color: 'white',
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  // Full-screen player styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
   
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullArtwork: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,

    shadowColor: 'red',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  fullTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: 'white',
    textAlign: 'center',
  },
  fullArtist: {
    fontSize: 18,
    color: 'grey',
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   
    width: '100%',
  },
  time: {
    color: 'white',
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
  },
  volumeLabel: {
    marginTop: 20,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  volumeSlider: {
    width: '100%',
  },
  volumeSliderContainer: {
    flexDirection:'row',
    position:'absolute',
    bottom:50,
  },
  fullControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
});
