import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchTracks } from '../networkRequest/spotifyRequest';
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';

export default function Fav() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Added state for refreshing
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const { addToQueue, addMoreSongsToQueue } = usePlayerContext();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTracks();
      const formattedTracks = data.items.map((item) => item.track);
      setTracks(formattedTracks);
      setNextPageUrl(data.next);
      setHasMore(data.next);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreTracks = async () => {
    if (hasMore && nextPageUrl && !isLoading) {
      try {
        setIsLoading(true);
        const data = await fetchTracks(nextPageUrl);
        const formattedTracks = data.items.map((item) => item.track);
        setTracks((prevTracks) => [...prevTracks, ...formattedTracks]);
        setNextPageUrl(data.next);
        setHasMore(data.next);
      } catch (err) {
        setError('Failed to load more tracks');
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
    addToQueue(tracks, index, 'fav'," https://api.spotify.com/v1/me/tracks?");
  };

  const renderItem = ({ item, index }) => (
    <TrackItem track={item} index={index} addToQueue={() => handleSongClick(index)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liked Songs</Text>
      </View>
      {error && <Text style={styles.errorText}>Failed to fetch tracks</Text>}
      {tracks.length > 0 ? (
        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreTracks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? <Text style={styles.loadingText}>Loading...</Text> : null}
          refreshing={refreshing} 
          onRefresh={handleRefresh} 
        />
      ) : (
        <>
          <Text style={styles.loadingText}>Loading...</Text>
          {!isLoading && tracks.length <= 0 && <Text style={styles.loadingText}>No Liked Songs Found</Text>}
        </>
      )}
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
    fontFamily: 'Outfit-Bold',
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
