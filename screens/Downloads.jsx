import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import RNFS from 'react-native-fs'
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';
import { DownloadContext } from '../context/SongDownloadStatusContext';
import { DeleteDownloadEvent, songDownloadEvent } from '../networkRequest/DownloadSongs';

export default function Downloads() {
  const [downloadedSongs, setDownloadedSongs] = useState([]);
  const {addToQueue}= usePlayerContext()

 

  useFocusEffect(
    React.useCallback(() => {
      console.log("rerendered");
      
      loadDownloadedSongs();
    }, [])
  );
  useEffect(()=>{
    DeleteDownloadEvent.addListener('songDeleted',()=>{
      console.log("deleted");
      loadDownloadedSongs();
      
    })
    return(()=>{
      DeleteDownloadEvent.removeAllListeners('songDeleted');
    })
  },[])
  useEffect(()=>{
    songDownloadEvent.addListener('songDownloaded',()=>{
      console.log("song has been downloaded message form eventlistenr");
      loadDownloadedSongs();
      
    });
    return(()=>{
      songDownloadEvent.removeAllListeners('songDownloaded')
    })

  },[])



  

  

  const loadDownloadedSongs = async () => {
    console.log("this is called logDWonoaded songs" );
    
    try {
      const downloadLocation = `${RNFS.DocumentDirectoryPath}/downloads`;
      const files = await RNFS.readDir(downloadLocation);
      const metadataFiles = files.filter(file => file.name.endsWith('_metadata.json'));
      
      const songsData = await Promise.all(
        metadataFiles.map(async file => {
          const content = await RNFS.readFile(file.path, 'utf8');
          return JSON.parse(content);
        })
      );
    
      
      
      setDownloadedSongs(songsData);
    } catch (error) {
      console.error('Error loading downloaded songs:', error);
    }
  };
  const handleSongClick = (index) => {
    addToQueue(downloadedSongs, index, "downloads");
  };

  useEffect(()=>{
 
    songDownloadEvent.addListener('songDownloaded',()=>{
      console.log('song has been downloaded');
      
      loadDownloadedSongs();
   
      
    })
    return(()=>{
      songDownloadEvent.removeAllListeners();
    })
    

  },[downloadedSongs])
  
  const NoSongs=()=>{
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:"black"}}>
            <Text style={{color:'white', fontFamily:'Outfit-Bold', fontSize:25}}>No Songs Found</Text>
        </View>
    )
}

  if(downloadedSongs.length<=0){
    return(
      <>
      <NoSongs/>
      </>
    )
  }
  const renderSongItem = ({ item,index }) => (
    <TrackItem 
      track={{
        name: item.title,
        artists: [{ name: item.artist }],
        album: {
          images: [{ url: `file://${item.thumbnailPath}` }]
        },
        id: item.id
      }}
      addToQueue={() => {handleSongClick(index)}}
    />
  );

  return (
    <View style={styles.container}>
   
      <FlatList
        data={downloadedSongs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      
        


        
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#fff',
  },
  listContainer: {
    padding:20,
  paddingBottom:150,

  },
});