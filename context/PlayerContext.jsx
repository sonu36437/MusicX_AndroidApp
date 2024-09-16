import TrackPlayer from 'react-native-track-player';
import { createContext, useEffect, useState, useContext } from 'react';
import { getSongSrc } from '../networkRequest/songSrc';  // Assuming this fetches the song URL dynamically
import { Alert } from 'react-native';
import { usePlaybackState } from 'react-native-track-player';

export const PlayerContext = createContext();


export const PlayerContextProvider = ({ children }) => {
  const playbackState = usePlaybackState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [favTracks, setFavTracks] = useState([]);
  const [searchTracks, setSearchTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Setup the player when the app starts
  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
        android:{
          appKilledPlaybackBehavior:TrackPlayer.AppKilledPlaybackBehavior.ContinuePlayback
        }
      });
      console.log('Player setup complete');
    };
    setupPlayer();
  }, []);

  useEffect(() => {
    console.log("Favorite tracks count:", favTracks.length);
    console.log(favTracks);
  }, [favTracks]);


  const addTrackToPlayer = async (track) => {
    // console.log("track is",track);
    try {
  
      const songUrl = await getSongSrc(track.title + " " + track.artists);
      if (!songUrl) {
       Alert.alert("No song found we are working on it");
        return;
      }

      const newTrack = { 
        id: track.id, 
        
        url: songUrl[songUrl.length - 1].url, 
        title: track.title, 
        artist: track.artists ,
        thumbnail: track?.thumbnail,

      };
      await TrackPlayer.reset();
      await TrackPlayer.add(newTrack);
      await TrackPlayer.play();
      console.log("Track added to player");

   
      setCurrentTrack(track);
    
      setIsPlaying(true);
    } catch (error) {
      console.error('Error adding track to player: ', error);
    }
  };


  const playTrackFromQueue = async (queue, index) => {
    console.log(index);
    const track = queue[index];
    setCurrentTrack(track);
    // console.log("tracks is",track);
    setCurrentTrackIndex(index);
    await addTrackToPlayer(track); 
  };

 
  const addToFavTracks = (tracks, index) => {

    if (favTracks.length === 0 || favTracks.length <=index) {
      console.log("add to fav executeed");
      const formattedTracks = tracks.map(track => ({
        id: track.track.id,
        title: track.track.name,
        artists: track.track.artists.map(artist => artist.name).join(', '),
        album: track.track.album.name,
        artwork: track.track.album.images[0].url,
       
      }));
     

      playTrackFromQueue(formattedTracks,index);
     

      setFavTracks(() => formattedTracks);
      setCurrentQueue("favTracks")
    }
   
  };

  const playNextTrack = async () => {
    // if (currentTrackIndex < currentQueue.length - 1) {
    //   const nextIndex = currentTrackIndex + 1;
    //   await playTrackFromQueue(currentQueue, nextIndex);
    // }
    console.log(currentQueue);
    if(currentQueue === "favTracks"  && currentTrackIndex <= favTracks.length - 1){
      const nextIndex = currentTrackIndex+1;
      await playTrackFromQueue(favTracks, nextIndex);
    }
  };

  const playPreviousTrack = async () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1;
      await playTrackFromQueue(currentQueue, prevIndex);
    }
  };

  const pauseTrack = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  
  };

  const resumeTrack = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      currentTrackIndex,
      isPlaying,
      setIsPlaying,
      favTracks,
      searchTracks,
      playlistTracks,
      addToFavTracks,
      addToSearchTracks: (track) => setSearchTracks([...searchTracks, track]),
      addToPlaylistTracks: (track) => setPlaylistTracks([...playlistTracks, track]),
      playTrackFromQueue,
      playNextTrack,
      playPreviousTrack,
      pauseTrack,
      resumeTrack,
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