import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import playerManagement from '../global/PlayerMangement';
import TrackPlayer from 'react-native-track-player';

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentSource, setCurrentSource] = useState(null);
  const isAlredySetup = useRef(false);

  useEffect(() => {
   if(isAlredySetup.current){console.log("already setup"); return;}
    playerManagement.setupPlayer().then(()=>{
      isAlredySetup.current = true;
    });
     

  }, []);
  const formatTracks = (tracks) => {
    return tracks.map((track) => {
      return {
        id: track.id,
        title: track.name,
        artist: track?.artists.map((artist) => artist.name).join(', '),
        artists: track.artists[0]?.name,
        artwork: track.album.images[0]?.url,

      }
    })


  }

  const addToQueue = (tracks, index, source,nextPageBaseUrl=null) => {
    // playerManagement.addSongsToQueue(tracks);
    // playerManagement.setCurrentSong(tracks[index]);
    // setCurrentTrack(tracks[index]);
    // console.log(playerManagement.getCurrentSong());

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
      playerManagement.addSongsToQueue(formattedTracks, index);
      // playerManagement.setCurrentSong(playerManagement.particularIndexSong(index));
      setCurrentTrack(playerManagement.particularIndexSong(index));
      playerManagement.fetchSongAndPlay(playerManagement.particularIndexSong(index))
    }
    else {

      setCurrentTrack(playerManagement.particularIndexSong(index));
      playerManagement.setCurrentSongIndex(index);
      // playerManagement.setCurrentSong(playerManagement.particularIndexSong(index));
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