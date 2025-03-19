import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../networkRequest/spotifyRequest';
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';
import UserPlaylist from '../networkRequest/userPlayList';
import Loading from '../components/Loading';
import { transcode } from 'buffer';

export default function Fav() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const { addToQueue } = usePlayerContext();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTracks();
      const formattedTracks = data.items.map((item) => item.track);
      setTracks(formattedTracks);
      setNextPageUrl(data.next);
      setHasMore(!!data.next);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // UserPlaylist.getUserPlaylist();
  }, []);

  const loadMoreTracks = async () => {
    if (hasMore && nextPageUrl && !isLoading) {
      try {
        setIsLoading(true);
        const data = await fetchTracks(nextPageUrl);
        const formattedTracks = data.items.map((item) => item.track);
        setTracks((prevTracks) => [...prevTracks, ...formattedTracks]);
        setNextPageUrl(data.next);
        setHasMore(!!data.next);
      } catch (err) {
        console.error('Error loading more tracks:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSongClick = (index) => {
    addToQueue(tracks, index, 'fav', 'https://api.spotify.com/v1/me/tracks?');
  };

  const renderItem = ({ item, index }) => (
    <TrackItem
      track={item}
      index={index}
      addToQueue={() => handleSongClick(index)}
    />
  );
  if(isLoading && tracks.length==0){
    return(
      <Loading message='Loading your Favourite songs'/>
    )
  }
  if(!isLoading && tracks.length==0){
    return (
  <View style={{flex:1 , justifyContent:'center',alignItems:"center" }}>
    <Text style={{fontFamily:"Outfit-Bold"}}>No songs in liked list </Text>
  </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Liked Songs</Text>
      </View> */}

   

      {tracks.length > 0 ? (
        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || `${Math.random()}`}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreTracks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? <Text style={styles.loadingText}>Loading...</Text> : null
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        isLoading && (
          <Text style={styles.loadingText}>Loading......</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
   paddingHorizontal:10,


  },
  // header: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'black',
  //   zIndex: 999,
  //   paddingHorizontal: 20,
  //   paddingTop: 20,
  //   paddingBottom: 10,
  // },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    paddingBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    fontFamily: 'Outfit-Bold',
  },
  listContent: {
    paddingTop:10,
    paddingHorizontal:5,

    paddingBottom: 150,
  },
  loadingText: {
    fontFamily: 'Outfit-Bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
});
