import { View, Text,FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect,useState } from 'react'
import UserPlaylists from '../networkRequest/userPlayList';
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';


const Loading=()=>{
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:"black"}}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{color:'white',fontFamily:"Outfit-Bold"}}>Loading Playlists...</Text>
      </View>
    )
}
const NoSongs=()=>{
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:"black"}}>
            <Text style={{color:'white', fontFamily:'Outfit-Bold', fontSize:25}}>No Songs Found</Text>
        </View>
    )
}


export default function PlayListSongs({ route }) {
  const { songUrl,playlistName } = route.params;
  console.log(playlistName);
  const nextPageBaseUrl=' https://api.spotify.com/v1/playlists/'
  
  const [songs, setSongs] = useState(null);
  const {addToQueue} = usePlayerContext()
  const [loading,setIsLoading]= useState(false)

  const handleSongClick = (index,currentPlaylist) => {
    addToQueue(songs, index, currentPlaylist);
  };

  const renderItem = ({ item, index }) => (
    <TrackItem 
      track={item}
      index={index}
      addToQueue={() => handleSongClick(index, songUrl)}
    />
  );

  useEffect(() => {
    const fetchSongItems = async () => {
        setIsLoading(true);
      const response = await UserPlaylists.getPlayListItem(songUrl);
      setIsLoading(false);
      console.log(response.next);
      
      
      const formattedSongs = response.items.map(item => item.track);
      console.log(formattedSongs.length
      );
      
      
      setSongs(formattedSongs);
    };
    fetchSongItems();
  }, []);
  if(loading){
    return (
        <Loading/>
    )
  }
  if(!songs|| songs.length<=0){
    return(
        <NoSongs/>
    )
  }

  return (
    <View style={{flex:1,backgroundColor:'black'}}>
    <View style={{flex:1,backgroundColor:"black", padding:10}}>
        <View style={{padding:20}}>
            <Text style={{color:'white', fontFamily:'Outfit-Bold', fontSize:25}}> {playlistName} </Text>
        </View>
     
        <FlatList
        
        data={songs}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id+`${item.index}`}
        ></FlatList>
        </View>
        </View>

   
  
  );
}
const styles=StyleSheet.create({
    listContent: {
      
        paddingBottom: 150,
      },

})