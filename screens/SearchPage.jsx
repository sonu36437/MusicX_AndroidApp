import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchTracks } from '../networkRequest/spotifyRequest';
import Loading from '../components/Loading';
import TrackItem from '../components/TrackItem';

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (input.length > 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const URL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(input)}&type=track,album,artist&limit=10`;
          const response = await fetchTracks(URL);
          console.log(response.tracks.items);
          
          setTracks(response.tracks.items); 
          setError(null);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      const timeOut=setTimeout(()=>{
        if(input){
          fetchData()
        }
      },500)
      return ()=>{
        clearTimeout(timeOut)
      }
      
   
    }
  }, [input]);

  const renderItem = ({ item }) => {
    return (
        <TrackItem track={item} /> 
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Search for songs or Artists
        </Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="search for songs......."
          placeholderTextColor="black"
          onChangeText={text => setInput(text)}
      
        />
      </View>
      {loading && <Loading />}
      {error && <Text style={styles.error}>{error}</Text>}
      {console.log(tracks)}
      {tracks.length>0 ? <Text style={{color:"white",fontFamily:"Outfit-Bold", fontSize:25, marginTop:30}}>Songs</Text>:null}

      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}  
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
        style={{marginTop:20}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 5,
    width: '100%',
    paddingBottom:120,
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
  listContent: {
    paddingBottom: 20,
  }
});
