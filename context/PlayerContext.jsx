import { View, Text } from 'react-native'
import React,{createContext,useState,useEffect,useRef,useCallback,useContext} from 'react'
import TrackPlayer from 'react-native-track-player'
import { getSongSrc } from '../networkRequest/songSrc'



export const PlayerContext = createContext();
export const PlayerContextProvider = ({children}) => {
    const [currentTrack,setCurrentTrack] = useState(null);
    const [isPlaying,setIsPlaying] = useState(false);


    const [currentTrackIndex,setCurrentTrackIndex] = useState(0);
    const queue=useRef([]);

    const formatTrack = (tracks) => {
        return tracks.map((track) => ({
            id:track.id,
            title:track.name,
            artist:track.artists[0].name,
            artists:track.artists.map((artist) => artist.name).join(','),
            album:track.album.name,
            
        }))
    }
    const addToQueue = (tracks,songIndex) => {
      const TrackToBeAdded = tracks.slice(queue.current.length,20);
      const formattedTracks = formatTrack(TrackToBeAdded);  
      queue.current.push(...formattedTracks);
      console.log(queue.current.length);
   
    }

    return (
    <PlayerContext.Provider value={{
        currentTrack,
        isPlaying,
     
     
        currentTrackIndex,
        queue,
        addToQueue,
    }}>
          {children}
      </PlayerContext.Provider>
    )


  


    
    
    
    
}
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerContextProvider");
  }
  return context;
}



