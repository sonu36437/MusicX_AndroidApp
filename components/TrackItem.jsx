import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react'

export default function TrackItem({track}) {
   
  return (
    <View style={styles.card}>
                <Image
                    source={{ uri: track.album.images[0].url }}
                    style={styles.albumArt}
                />
                <View style={styles.trackInfo}>
                    <Text style={styles.trackName}>{track.name}</Text>
                    <Text style={styles.artists}>{track.artists.map(artist => artist.name).join(', ')}</Text>
                </View>
                <TouchableOpacity style={styles.moreOptions}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black', 
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 60,
        borderTopRightRadius:5,
        borderTopLeftRadius:5
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit-Bold',
        color: '#fff',
        marginBottom: 20,
    },
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