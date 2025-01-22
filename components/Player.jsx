import React, { useState, useEffect,useCallback,Component } from 'react';
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
  BackHandler,
  Pressable,
  SafeAreaView
} from 'react-native';
import TrackPlayer, { usePlaybackState, useProgress, Event } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { usePlayerContext } from '../context/PlayerContext';
import Blurvw from './Blurvw';


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
        <View style={styles.absolutePlayerContainer}>
          <View style={{flex:1,}}>
     
         
            <Blurvw imageUrl={currentTrack?.artwork }/>
   
          <Pressable style={styles.innerContainer} onPress={toggleFullScreen}>
            <Image source={{ uri: currentTrack?.artwork }} style={styles.thumbnail} blurRadius={1} />
            <View style={styles.trackInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack?.title || 'Unknown Title'}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack?.artist || 'Unknown Artist'}
              </Text>
            </View>
            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </Pressable >
         
        </View>
        </View>
 
      )}

      {currentTrack && showFullScreen && (
        <Modal visible={showFullScreen} animationType="slide" transparent={true}
          onRequestClose={toggleFullScreen}>
          <View style={{flex:1,backgroundColor:'black'}}>
            <Blurvw imageUrl={currentTrack?.artwork} blurAmount={100}/>
            <View style={styles.fullScreenContainer}>
              {/* <LinearGradient
                colors={['rgb(178,200,42)', 'rgb(178, 255, 62)', 'rgba(178,200,200,0.9)']}
                style={styles.fullScreenGradient}
              /> */}
              <TouchableOpacity onPress={toggleFullScreen} style={styles.closeButton}>
                <Ionicons name="chevron-down" size={50} color="rgba(255,255,255,0.7)" />
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
                  <Ionicons name="play-skip-back" size={50} color="rgba(0,0,0,0.7)" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={80}
                    color="rgba(0,0,0,0.7)"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipToNext}>
                  <Ionicons name="play-skip-forward" size={50} color="rgba(0,0,0,0.7)" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  absolutePlayerContainer: {
    position: 'absolute',
    backgroundColor:'black',
    borderBottomColor:'white',
    justifyContent:'center',
  
    bottom: 68,
    left: '2.5%',
    width: '95%',
  
    height: 70,
    
    borderRadius: 20,
overflow:'hidden'
  
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode:'stretch',

  },
  innerContainer: {
    position:'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  title: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
  },
  artist: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
  },
  playButton: {
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
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  fullArtist: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily:'Outfit-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '90%',
 
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  time: {
    color: 'white',
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
