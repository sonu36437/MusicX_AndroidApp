import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress,Event } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerContext';
import BufferingIcon from './BufferingIcon';

export default function Player({TrackDetail}) {
  const {  skipToNext, skipToPrevious, isBuffering, setIsBuffering,currentSource } = usePlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack,setCurrentTrack]=useState(null);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const slideAnim = React.useRef(new Animated.Value(200)).current;

  useEffect(() => {
    console.log("Player component mounted");
  console.log(TrackDetail);
  if(TrackDetail){
    setCurrentTrack(TrackDetail);
  }
  
    // Set up the event listener
    const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged || Event.PlaybackState, async (event) => {
      if (event.track) {
        
  
        setCurrentTrack(event.track
        );
      }
    });
    

    
   


   
    return () => {
      listener.remove();
      console.log("player unmounted")
    };
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  useEffect(() => {
    if (playbackState.state === "playing") {
      setIsPlaying(true);
      setIsBuffering(false);
    } else if (playbackState.state === 'buffering') {
      setIsBuffering(true);
    } else {
      setIsPlaying(false);
    }
  }, [playbackState]);



  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };
  

  const handleVolumeChange = async (value) => {
    setVolume(value);
    await TrackPlayer.setVolume(value);
  };

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  return (
    <>
      {/* {console.log(currentTrack)} */}

      {currentTrack && !showFullScreen && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{
                translateY: slideAnim
              }]
            }
          ]}
        >
          <TouchableOpacity style={styles.innerContainer} onPress={toggleFullScreen}> 
             <Image source={{ uri: currentTrack?.artwork }} style={styles.artwork} />
          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={1}>{currentTrack?.title || 'Unknown Title'}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentTrack?.artist|| 'Unknown Artist'}</Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity onPress={skipToPrevious}>
              <Ionicons name="play-skip-back" size={30} color="yellow" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              {isBuffering?<BufferingIcon/>:<Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={50} color="yellow" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons name="play-skip-forward" size={30} color="yellow" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        </Animated.View>
      )}

      {/* Full-Screen Player */}
      {currentTrack && (

        <Modal visible={showFullScreen} animationType="slide" transparent={true}>

          <View style={styles.fullScreenContainer}>
            <Text style={{fontFamily:'Outfit-Medium', color:'black', position:'absolute', top:20,fontSize:12,backgroundColor:'white',padding:10,borderRadius:50}} numberOfLines={2}> Playing from {currentSource}</Text>
            <TouchableOpacity onPress={toggleFullScreen} style={styles.closeButton}>
              
              <Ionicons name="close" size={30} color="yellow" />
            </TouchableOpacity>

            <Image source={{ uri: currentTrack?.artwork }} style={styles.fullartwork} />
            <Text style={styles.fullTitle}>{currentTrack?.title || 'Unknown Title'}</Text>
            <Text style={styles.artist}>Artists: {currentTrack?.artist|| 'Unknown Artist'}</Text>

            <Slider
              style={styles.slider}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="yellow"
              maximumTrackTintColor="white"
              thumbTintColor="yellow"
            />
            <View style={styles.progressContainer}>
              <Text style={styles.time}>{new Date(progress.position * 1000).toISOString().substr(14, 5)}</Text>
              <Text style={styles.time}>{new Date(progress.duration * 1000).toISOString().substr(14, 5)}</Text>
            </View>



            <View style={styles.fullControls}>
              <TouchableOpacity onPress={skipToPrevious}>
                <Ionicons name="play-skip-back" size={40} color="yellow" />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
              {isBuffering?<BufferingIcon/>:<Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color="yellow" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext}>
                <Ionicons name="play-skip-forward" size={40} color="yellow" />
              </TouchableOpacity>
            </View>
            {/* Volume Slider */}
            {/* <Text style={styles.volumeLabel}>Volume</Text> */}
            <View style={styles.volumeSliderContainer}>
              <Ionicons name='volume-high' size={30} color='yellow' />
              <Slider
                style={styles.volumeSlider}
                value={volume}
                minimumValue={0}
                maximumValue={0.7}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="yellow"
                maximumTrackTintColor="#B3B3B3"
                thumbTintColor="yellow"
              />


            </View>
          </View>

        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 65,
    width: '100%',
  },
  innerContainer: {
    backgroundColor: 'black',
    flexDirection: 'row',
    borderTopColor: 'yellow',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    shadowColor: 'yellow',
    shadowOpacity: 0.4,
    shadowOffset: {width: 10, height: -40},
    shadowRadius: 70,
    elevation: 20,
  },
  fullartwork: {
    width: 350,
    height: 350,
    borderRadius: 5,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 14, height: 2 },
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
    color: 'gray',
    fontFamily: 'Outfit-Medium',

    // textAlign:'center',
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
    flex: 1,
    marginHorizontal: 10,
  },
  volumeSliderContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
  fullControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
});