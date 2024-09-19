import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../networkRequest/spotifyRequest';
import TrackItem from '../components/TrackItem';

import { getSongSrc } from '../networkRequest/songSrc';
import {usePlayerContext} from '../context/PlayerContext';
import TrackPlayer from 'react-native-track-player';
import { hasDynamicIsland } from 'react-native-device-info';
import Player from '../components/Player';


export default function Fav() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const {addToQueue,playTrack,loadMoreUrl,setLoadMoreUrl}=usePlayerContext();

 
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTracks();
        setTracks(data.items);
        setNextPageUrl(data.next);
       
        setHasMore(data.next);
      } catch (err) {
        setError('Failed to fetch tracks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
 
  



  

  

  
  const loadMoreTracks = async () => {
    if (hasMore && nextPageUrl && !isLoading) {
      try {
        setIsLoading(true);
        const data = await fetchTracks(nextPageUrl);
        setTracks(prevTracks => [...prevTracks, ...data.items]);
        setNextPageUrl(data.next);
        setHasMore(data.next);
      } catch (err) {
        setError('Failed to load more tracks');
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleSongClick=async (index)=>{
    console.log(tracks[index].track.album.images[0].url);
  
    addToQueue(tracks,index);
    // playTrack(index);
    setLoadMoreUrl(nextPageUrl);

 

    
  
  }


  const renderItem = ({ item, index }) => (
    <TrackItem track={item.track} index={index} addToQueue={() => handleSongClick(index)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Songs</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
   { tracks.length>0?  <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.track.id}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreTracks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <Text style={styles.loadingText}>Loading...</Text> : null}
      />:
      <Text style={styles.loadingText}>You haven't any Songs</Text>}
 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: '30%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  loadingText: {
    fontFamily: 'Outfit-Bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 20,
  },
});
