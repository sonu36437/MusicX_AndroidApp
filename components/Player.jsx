import React, { useState, useEffect,useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useImageColors from '../assets/hooks/useColor';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  BackHandler
} from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress, Event } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayerContext } from '../context/PlayerContext';


export default function Player({ TrackDetail }) {
  const { skipToNext, skipToPrevious, isBuffering, setIsBuffering, currentSource } = usePlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const playbackState = usePlaybackState();
  const [color, setColors] = useState(null);
  const progress = useProgress();
  const navigation= useNavigation();


  const [showFullScreen, setShowFullScreen] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(200)).current;
  

  useEffect(()=>{
    const backPressHandler=BackHandler.addEventListener('hardwareBackPress',()=>{console.log("back Predded");
      console.log("back Predded");
      
    })
    return () => backPressHandler.remove();
  },[showFullScreen])
  


  useEffect(() => {
    if (TrackDetail) {
      setCurrentTrack(TrackDetail);
    }
  

    const listener = TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async (event) => {
      if (event.track) {
        setCurrentTrack(event.track);
        console.log(event.track.artwork);



       
      }
    });
      
 
 
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    return () => listener.remove();
  }, []);

  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  useEffect(() => {
    if (playbackState.state === 'playing') {
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

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  return (
    <>
      {currentTrack && !showFullScreen && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.innerContainer} onPress={toggleFullScreen}>
            <Image source={{ uri: currentTrack?.artwork }} style={styles.artwork} />
            <View style={styles.trackInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack?.title || 'Unknown Title'}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack?.artist || 'Unknown Artist'}
              </Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={25}
                  color="black"
                  style={styles.controlIcon}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {currentTrack && (
        <Modal visible={showFullScreen} animationType="slide" transparent={true}>
          <View style={styles.fullScreenContainer}>
            <LinearGradient
              colors={['rgb(178,200,42)', 'rgb(178, 255, 62)', 'rgba(178,200,200,0.9)']}
              style={styles.fullScreenGradient}
            />
            <TouchableOpacity onPress={toggleFullScreen} style={styles.closeButton}>
              <Ionicons name="chevron-down" size={50} color="black" />
            </TouchableOpacity>
            <Image source={{ uri: currentTrack?.artwork }} style={styles.fullArtwork} />
            <Text style={styles.fullTitle}>{currentTrack?.title || 'Unknown Title'}</Text>
            <Text style={styles.fullArtist}>
              {currentTrack?.artist || 'Unknown Artist'}
            </Text>
            <Slider
              style={styles.slider}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="black"
              maximumTrackTintColor="#555"
              thumbTintColor="black"
            />
            <View style={styles.progressContainer}>
              <Text style={styles.time}>
                {new Date(progress.position * 1000).toISOString().substr(14, 5)}
              </Text>
              <Text style={styles.time}>
                {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
              </Text>
            </View>
            <View style={styles.fullControls}>
              <TouchableOpacity onPress={skipToPrevious}>
                <Ionicons name="play-skip-back" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={80}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext}>
                <Ionicons name="play-skip-forward" size={50} color="black" />
              </TouchableOpacity>
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
    left:10,
    bottom: 68,
    width: '95%',
 
    backgroundColor: 'rgb(178, 255, 62)',
    borderRadius:40


  },
  innerContainer: {
    position:'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    shadowColor:'red',
    elevation:20,


 
  },
  artwork: {
    width: 50,
    height: 50,

    borderRadius: 5,
    marginLeft: 10,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: 'black',
    fontSize: 13,
    fontFamily:'Outfit-Bold'
  },
  artist: {
    color: 'gray',
    fontSize: 9,
    fontFamily:'Outfit-Bold'
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    padding: 5,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    bottom:0,
    height:'100%',
    width:'100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
  
  },
  fullScreenGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullArtwork: {
    width: "98%",
    height: '52%',
    borderRadius: 10,
    marginBottom: 20,
  },
  fullTitle: {
    fontSize: 20,
    fontFamily:'Outfit-Bold',
    color: 'black',
    textAlign: 'center',
  },
  fullArtist: {
    fontSize: 12,
    color: 'gray',
    fontFamily:'Outfit-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '90%',
    height: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  time: {
    color: 'black',
    fontSize: 12,
    fontFamily:'Outfit-Bold'
  },
  fullControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginTop: 20,
  },
});
