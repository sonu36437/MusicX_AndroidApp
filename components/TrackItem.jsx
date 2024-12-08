import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useRef, useState, useContext } from 'react';
import musicIcon from '../assets/images/musicIcon.jpg';
import PopUp from './PopUp';
import { PopupContext } from '../context/PopupContext';

export default function TrackItem({ track, index, addToQueue }) {
  const { setPopup, popupContent,setPopupContent} = useContext(PopupContext);

  const togglePopup = () => {
    setPopup(true);
 
    
    setPopupContent({
      image:track.album.images[0]?.url,
      title:track.name,
      artist:track.artists.map(artist => artist.name).join(', '),
      id:track.id,
      

    })
  }

  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={addToQueue}>
        <View style={styles.card}>  
          <Image
            source={{uri: track.album.images[0]?.url || 'https://i.pinimg.com/736x/43/88/40/438840ca10593324de82e90e29218f2d.jpg'}}
            style={styles.albumArt}
          />
          <View style={styles.trackInfo}>
            <Text style={styles.trackName}>{track.name}</Text>
            <Text style={styles.artists}>{track.artists.map(artist => artist.name).join(', ')}</Text>
          </View>
          <TouchableOpacity style={styles.moreOptions} onPress={togglePopup}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  artists: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    color: '#b3b3b3',
  },
  moreOptions: {
    padding: 5,
  },
});
