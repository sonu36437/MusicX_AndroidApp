import { View, Text, StyleSheet , Image, Dimensions, TouchableOpacity} from 'react-native'
const {width,height} = Dimensions.get('window')

import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
// const url="https://i.scdn.co/image/ab67616d0000b27308f098d9f446be13668e441d";


const GradientOverlay = () => {
  return (
    <LinearGradient
      style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)','rgba(0,0,0,0.3)','rgba(0,0,0,0.8)','rgba(0,0,0,1)']}
    />
  )
}

export default function PlaylistItem({ name, imageUrl,songsUrl ,totalItems=0}) {
const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={()=>{navigation.navigate('PlaylistItem',{songUrl:songsUrl,playlistName:name});console.log(songsUrl)}} >
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image 
          source={{uri: imageUrl || 'https://i.pinimg.com/736x/43/88/40/438840ca10593324de82e90e29218f2d.jpg'}} 
          style={styles.image}
        />
        <GradientOverlay />
        <Text style={styles.playlistTitle} numberOfLines={3}>
          {name}
        </Text>
        <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 16, fontFamily: "Outfit-Medium", marginTop: 8,textAlign:'center'}}>Total songs:{totalItems}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: height/2,  
    marginBottom: 80,  

  },
  imageContainer: {
    flex: 1,
    // position: 'relative',
    borderRadius: 8,

    marginHorizontal: 16, 
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playlistTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign:'center',

    color: 'white',
    fontFamily: "Outfit-Bold",
    fontSize: 24,
  }
})