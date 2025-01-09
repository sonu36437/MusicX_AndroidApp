import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import playlistStore from '../global/store/playlistState'; // Import the Zustand store
import PlaylistItem from '../components/PlaylistItem';
import { ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlayListSongs from './PlayListSongs';

const Stack = createNativeStackNavigator();
const PlaylistStackNavigator=()=>{
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="Playlists" component={PlaylistScreen}/>
    <Stack.Screen name="PlaylistItem" component={PlayListSongs}/>
    </Stack.Navigator>
  )
}

const PlaylistScreen = () => {
  const { currentUserPlaylist, loading, error, fetchPlaylists } = playlistStore();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{color:'white',fontFamily:"Outfit-Bold"}}>Loading Playlists...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.title, { color: 'red' }]}>Error: {error}</Text>
      </View>
    );
  }
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your playlists</Text>
      </View>
      <View style={styles.playlistsContainer}>
        {currentUserPlaylist.map((playlist) => (
          <PlaylistItem 
            key={playlist.playlistId}
            name={playlist.name}
            imageUrl={playlist.images[0]?.url}
            songsUrl={playlist.tracks

            }
            totalItems={playlist.totalItems}
            // totalTracks={playlist.totalItems}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   width:"100%",
    backgroundColor:"black"
  },
  header: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: 'black',
    // zIndex: 999,
    paddingHorizontal: 4,
    paddingTop: 30,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    // paddingBottom: 10,
  },
  playlistsContainer: {
    paddingVertical: 16,
    paddingBottom:150
  },
  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black',
    color:'white'
  }
});

export default PlaylistStackNavigator;
