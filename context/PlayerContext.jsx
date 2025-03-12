import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import playerManagement from '../global/PlayerMangement';
import {TrackPlayer,RepeatMode }from 'react-native-track-player';
import { AppState } from 'react-native';
import SongQueue from '../global/Queue';
import { play } from 'react-native-track-player/lib/src/trackPlayer';


export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentSource, setCurrentSource] = useState(null);
  const isAlredySetup = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const setupAndHandleAppState = async () => {
      if (!isAlredySetup.current) {
        try {
          await playerManagement.setupPlayer();
          isAlredySetup.current = true;
        } catch (error) {
          console.log('Error setting up player:', error);
        }
      }
    };

 

    setupAndHandleAppState();

  
  }, []);

  const formatTracks = (tracks) => {
    console.log("tracksDATa: ",tracks);
    
    return tracks.map((track) => {
      return {
        id: track.id,
        title: track.name||track.title,
        artist: track.artist||track?.artists.map((artist) => artist.name).join(', ')||'unknwon',
        artists: track.artist||track.artists[0]?.name||'unknown',
        artwork: track.thumbnailPath?`file://${track.thumbnailPath}` :track.album.images[0]?.url,

      }
    })


  }

  const addToQueue = (tracks, index, source,nextPageBaseUrl=null) => {
    console.log( "clicked song:",tracks[index]);
    console.log("form the queeu: ",playerManagement.getTracksInQueue().queue[index]);
    if(tracks[index].id!==playerManagement.getTracksInQueue().queue[index]){
      playerManagement.clearQueue();

    }
    
    
    
     const src=String(source);
     const regex=/search/ig
     const result=regex.test(src);
      if(result || source==="home"){
    const formattedTracks=formatTracks(tracks);
      playerManagement.playSingle(formattedTracks[index])
     result? playerManagement.playingFrom=src?.match(regex)[0]:playerManagement.playingFrom=source;
  
      
      
        return ;
      }
  
  
  
    

    


    // playerManagement.fetchSongAndPlay(tracks[index]);
    const queueLength = playerManagement.getQueueLength();

    if (queueLength < 1 || queueLength < index || source !== currentSource) {
     if(nextPageBaseUrl!==null) playerManagement.fetchMoreUrl=nextPageBaseUrl;
    
      if (source !== currentSource) {
        playerManagement.clearQueue();
      }
      console.log("adding songs to queue");
      setCurrentSource(source)
      const formattedTracks = formatTracks(tracks);
      playerManagement.playingFrom=source;
      playerManagement.addSongsToQueue(formattedTracks, index);
      playerManagement.setCurrentSong(playerManagement.particularIndexSong(index));
      setCurrentTrack(playerManagement.particularIndexSong(index));
      playerManagement.fetchSongAndPlay(playerManagement.particularIndexSong(index))
    }
    else {

      setCurrentTrack(playerManagement.particularIndexSong(index));
      playerManagement.setCurrentSongIndex(index);
      playerManagement.fetchSongAndPlay(playerManagement.particularIndexSong(index));
     

    }


  };

  const skipToNext = async () => {
    await playerManagement.skipToNext();
    console.log(playerManagement.getQueueLength());
    setCurrentTrack(playerManagement.getCurrentSong());
  };

  const skipToPrevious = async () => {
    await playerManagement.skipToPrevious();
    setCurrentTrack(playerManagement.getCurrentSong());
  };

  const addMoreSongsToQueue = (songs) => {
    playerManagement.addSongsToQueue(songs);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isBuffering,
      setIsBuffering,
      currentSource,
      addToQueue,
      skipToNext,
      skipToPrevious,
      addMoreSongsToQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);