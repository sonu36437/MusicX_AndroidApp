import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchTracks } from '../networkRequest/spotifyRequest';
import Loading from '../components/Loading';
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl,setNextPageUrl]=useState(null);
  const [error, setError] = useState(null);
  const { addToQueue,queue } = usePlayerContext();
  const [searchId,setSearchId]=useState();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(()=>{
    console.log("search page mounted");
    return ()=>{
      console.log("search page unmounted");
    }

  },[])

  useEffect(() => {
    if (input.length > 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const URL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(input)}&type=track&limit=10`;
          const response = await fetchTracks(URL);
          setSearchId(Date.now());
          setNextPageUrl(response.tracks.next);
          setTracks(response.tracks.items); 
          setError(null);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      const timeOut = setTimeout(() => {
        if (input) {
          fetchData();
        }
      }, 500);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [input]);

  const handleSongClick = (index) => {
    // Add to queue

    addToQueue(tracks, index,`search${searchId}`);
  };

  const renderItem = ({ item, index }) => (
    <TrackItem track={item} index={index} addToQueue={() => handleSongClick(index)} />
  );

  const loadMoreTracks = async () => {
    if (!nextPageUrl || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const response = await fetchTracks(nextPageUrl);
      setNextPageUrl(response.tracks.next);
      setTracks(prevTracks => [...prevTracks, ...response.tracks.items]);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.contents}>
      <View>
        <Text style={styles.title}>Search for songs or Artists</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for songs..."
          placeholderTextColor="black"
          onChangeText={text => setInput(text)}
        />
      </View>
      {loading && <Loading />}
      {error && <Text style={styles.error}>{error}</Text>}
    
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={tracks.length > 0 && <Text style={styles.songsTitle}>Songs</Text>}
        ListFooterComponent={
          tracks.length > 0 && nextPageUrl && (
            <TouchableOpacity 
              style={styles.loadMoreButton} 
              onPress={loadMoreTracks}
              disabled={isLoadingMore}
            >
              <Text style={styles.loadMoreText}>
                {isLoadingMore ? 'Loading...' : 'Load More Songs'}
              </Text>
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.listContent}
        style={{ marginTop: 20 }}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'black',
    padding: 5,
    width: '100%',
  
  },
  contents:{
    flex:1,
    marginBottom:50,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    margin: 30,
    fontFamily: 'Outfit-Bold',
    fontSize: 25,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 3,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: 'black',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  songsTitle: {
    color: "white",
    fontFamily: "Outfit-Bold",
    fontSize: 25,
    marginTop: 30,
    paddingBottom:20
  },
  listContent: {
    paddingBottom: 100,
  },
  loadMoreButton: {
    backgroundColor: 'rgb(178, 255, 62)',
    color:'black',
    padding: 15,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  loadMoreText: {
    color: 'black',
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
  },
});
