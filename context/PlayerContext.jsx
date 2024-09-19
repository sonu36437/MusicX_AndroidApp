import TrackPlayer, { usePlaybackState } from 'react-native-track-player';
import { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { getSongSrc } from '../networkRequest/songSrc';
import { loadMore } from '../networkRequest/loadMore';
import { Alert } from 'react-native';

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const playbackState = usePlaybackState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [queue, setQueue] = useState([]);
  const [loadMoreUrl, setLoadMoreUrl] = useState(null);
  useEffect(() => {
    playTrack(currentIndex);

  }, [queue])
  


  useEffect(() => {
    if (currentIndex === queue?.length -1) {
      

      loadMore(loadMoreUrl).then(d => {
        if(d.next){ 
        setQueue(prevQueue => [...prevQueue, ...d.items])
        setLoadMoreUrl(d.next)
      }

      });
    }
  }, [currentIndex, queue])

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        console.log('Player setup complete');
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };
    !isReady && setupPlayer();
    setIsReady(true);
  }, []);
  useEffect(() => {



  }, [queue])

  const addToQueue = useCallback(async (tracks, songToBePlayedIndex) => {
    console.log("from add to queue",tracks);
    setQueue(tracks);
    setCurrentIndex(songToBePlayedIndex);
  }, []);

  const fetchAndPlayTrack = useCallback(async (track) => {

    track = track.track;
    console.log(track.artists[0].name);


    try {
      const songUrl = await getSongSrc(track.name + " " + track.artists[0].name);

      if (!songUrl) {
        console.error('No song URL found');
        skipToNext()
        return;


      }

      const formattedTrack = {
        id: track.id,
        url: songUrl[songUrl.length - 1].url,
        title: track.name,
        artists: track.artists.map(artist => artist.name).join(", "),
        artwork: track?.album?.images[0]?.url,
      };


      await TrackPlayer.reset();
      await TrackPlayer.add(formattedTrack);
      await TrackPlayer.play();
      setCurrentTrack(formattedTrack);

      setIsPlaying(true);
    } catch (error) {
      console.error('Error fetching and playing track:', error);
    }
  }, []);

  const playTrack = useCallback(async (index,track) => {
    if (index >= 0 && index < queue.length) {
      await fetchAndPlayTrack(queue[index]||track);
      setCurrentIndex(index);
    }
  
  }, [queue, fetchAndPlayTrack, currentIndex]);

  const pauseTrack = useCallback(async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  }, []);

  const skipToNext = useCallback(async () => {
    console.log(queue.length);


    const nextIndex = (currentIndex + 1) % queue.length;

    console.log(nextIndex);
    await playTrack(nextIndex);
    setCurrentIndex(nextIndex);


  }, [queue, currentIndex]);

  const skipToPrevious = useCallback(async () => {
    const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex > 0) {
      await playTrack(currentIndex - 1);
    }
  }, [queue, currentTrack, playTrack]);

  const contextValue = {
    currentTrack,
    isPlaying,
    queue,
    addToQueue,
    playTrack,
    pauseTrack,
    resumeTrack,
    setLoadMoreUrl,
    loadMoreUrl,
    skipToNext,
    skipToPrevious,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
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