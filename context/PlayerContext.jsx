import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import { getSongSrc } from '../networkRequest/songSrc';
import { View, Text, Button, Alert } from 'react-native';
import { fetchTracks } from '../networkRequest/spotifyRequest';

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args)

    }, wait);
  }
}

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const currentTrackPlaying = useRef(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const playMoreUrl = useRef(null);
  const debouncedPlayTrack = useRef(debounce((index) => playTrack(index), 1000)).current;


  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();

      console.log('Player setup complete');
      return () => {
        console.log("revmovved tralkjdlfjsd");

      }
    };
    setupPlayer();
  }, []);
 




  const playTrack = async () => {
    console.log(currentTrackPlaying.current.title);
    setIsBuffering(true);
    const songUrl = await getSongSrc(currentTrackPlaying.current.title + " " + currentTrackPlaying.current.artist);
    if (!songUrl) {

      Alert.alert("no song url found moving to next song");


    }
    const track_with_url = {
      ...currentTrackPlaying.current, url: songUrl[songUrl.length - 1].url
    }
    await TrackPlayer.reset()
    await TrackPlayer.add(track_with_url);
    await TrackPlayer.play();








  };

  const formattedTracks = (tracks) => {
    return tracks.map((track) => {
      return {
        id: track.id,
        title: track.name,
        artists: track?.artists.map((artist) => artist.name).join(', '),
        artist: track.artists[0]?.name,
        artwork: track.album.images[0]?.url,

      }
    })


  }
  const addMoreSongsToQueue=(tracks)=>{
  const moreSongs=  formattedTracks(tracks);
  setQueue((prev)=>[...prev,...moreSongs]);

  }

  const addToQueue = async (tracks, songToBePlayedIndex, source) => {
    if (queue.length <= 0 || songToBePlayedIndex > queue.length - 1 || source !== currentSource) {
      const tracksInQueue = formattedTracks(tracks);
      if (source !== currentSource)
        setCurrentSource(source);
      setCurrentTrack(tracksInQueue[songToBePlayedIndex]);

      setQueue(tracksInQueue);
      setCurrentTrackIndex(songToBePlayedIndex);
      currentTrackPlaying.current = tracksInQueue[songToBePlayedIndex]
      debounce(() => playTrack(), 1000)();

    } else {
      setCurrentTrackIndex(songToBePlayedIndex);
      setCurrentTrack(queue[songToBePlayedIndex]);
      currentTrackPlaying.current = queue[songToBePlayedIndex];
      debounce(() => playTrack(songToBePlayedIndex), 1000)();
    }
  };

  const skipToNext = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % queue.length;
    if (nextTrackIndex < queue.length) {
      debouncedPlayTrack(nextTrackIndex);
      setCurrentTrackIndex(nextTrackIndex);
      setCurrentTrack(queue[nextTrackIndex]);
      currentTrackPlaying.current = queue[nextTrackIndex];
      console.log(playMoreUrl.current);

    }
  };

  return (

    <PlayerContext.Provider value={{
      addToQueue,
      queue,
      currentTrack,
      skipToNext,
      isBuffering,
      setIsBuffering,
      playMoreUrl,queue,setQueue,currentTrackIndex,addMoreSongsToQueue

    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerContextProvider');
  }
  return context;
};