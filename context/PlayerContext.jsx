import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { View, Text, Button } from 'react-native';

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentSource, setCurrentSource] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  useEffect(() => {
    console.log(queue[0]);
  }, [queue])








  const playTrack = (index) => {


    setTimeout(() => {
      console.log("playing track");

    }, 1000);


  };
  const formattedTracks = (tracks) => {
    return tracks.map((track) => {
      return {
        id: track.id,
        title: track.name,
        artists: track.artists.map((artist) => artist.name).join(', '),
        artist: track.artists[0].name,
        artwork: track.album.images[0].url,

      }
    })


  }

  const addToQueue = async (tracks, songToBePlayedIndex, source) => {

    if (queue.length <= 0 || songToBePlayedIndex > queue.length - 1 || source !== currentSource) {
      const tracksInQueue = formattedTracks(tracks);
      
        if (source !== currentSource)
          setCurrentSource(source);
      
      setQueue(tracksInQueue);
      setCurrentTrackIndex(songToBePlayedIndex)
      playTrack(songToBePlayedIndex);
      setCurrentTrack(tracksInQueue[songToBePlayedIndex]);
    }
    else {
      setCurrentTrackIndex(songToBePlayedIndex);
      playTrack(songToBePlayedIndex);
      setCurrentTrack(queue[songToBePlayedIndex]);
    }
  };
  const skipToNext = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % queue.length;
    if (nextTrackIndex < queue.length) {
      playTrack(nextTrackIndex);
      setCurrentTrackIndex(nextTrackIndex);
      setCurrentTrack(queue[nextTrackIndex]);
    }
  }


  return (

    <PlayerContext.Provider value={{ addToQueue, queue, currentTrack, skipToNext }}>
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