import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import RNFS from 'react-native-fs'
import TrackItem from '../components/TrackItem';
import { usePlayerContext } from '../context/PlayerContext';

export default function Downloads() {
  const [downloadedSongs, setDownloadedSongs] = useState([]);
  const {addToQueue}= usePlayerContext()

  useFocusEffect(
    React.useCallback(() => {
      loadDownloadedSongs();
    }, [])
  );
  

  

  const loadDownloadedSongs = async () => {
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
      console.log(songsData);
      
      
      setDownloadedSongs(songsData);
    } catch (error) {
      console.error('Error loading downloaded songs:', error);
    }
  };
  const handleSongClick = (index) => {
    addToQueue(downloadedSongs, index, "downloads");
  };

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
      <Text style={styles.header}>Downloads</Text>
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
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
});