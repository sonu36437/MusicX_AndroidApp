import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { addToLikedList, fetchTracks, removeFromLikedList } from '../networkRequest/spotifyRequest';

const FavoriteButton = ({ isLiked, onPress, checkIsLiked }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={{ marginTop: 10, alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
      <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 14, color: isLiked ? 'rgba(255,0,0,0.8)' : 'green' }} numberOfLines={1}>
        { checkIsLiked ? '.....' : (isLiked ? 'Remove from Favourites' : 'Add to Favourites') }
      </Text>
    </View>
  </TouchableOpacity>
);

export default function PopUpContent({ content }) {
  const [isLiked, setIsLiked] = useState(false);
  const [checkIsLiked,setCheckLiked]=useState(false);

  const isliked = useCallback(async () => {
    setCheckLiked(true);
    const res = await fetchTracks(`https://api.spotify.com/v1/me/tracks/contains?ids=${content.id}`);
    setCheckLiked(false);
    setIsLiked(res[0]);
  }, [content.id]);
  
  const handleSongStatus=async()=>{
   
    if(isLiked===null)return;
    console.log(isLiked);
    
    
   if (isLiked===false){
    const res= await addToLikedList(content.id);
    console.log(res);
    setIsLiked(true);
    Alert.alert("added to liked list")
    return;
  }
  else{
    // console.log("removeing");return;
    
       const res=await removeFromLikedList(content.id);
       setIsLiked(false);
       console.log("removed");
       
       return;
  }


  }

  useEffect(()=>{
    console.log(content.id);
    isliked();
  },[content.id])
 

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
        <Image
          source={{ uri: `${content.image}` }}
          style={[{ width: 80, height: 80, borderRadius: 10 }, styles.imageStyle]}
        />
      </View>
      <View style={styles.titleStyle}>
        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 20, color: 'white' }} numberOfLines={3}>
          {content.title}
        </Text>
      </View>
      <View style={{ marginTop: 0, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: 'rgba(255,255,255,0.7)' }} numberOfLine={2}>
          {content.artist}
        </Text>
      </View>
      <FavoriteButton isLiked={isLiked} onPress={handleSongStatus} checkIsLiked={checkIsLiked} />
      <View style={{ marginTop: 10, alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: 'black' }} numberOfLines={1}>
          Add To Playlist
        </Text>
      </View>
      <View style={{ marginTop: 10, alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: 'black' }} numberOfLines={1}>
          View more by Artist
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    borderTopColor: 'yellow',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    shadowColor: 'yellow',
    shadowOpacity: 0.4,
    shadowOffset: {width: 10, height: -40},
    shadowRadius: 70,
    elevation: 20,
  },
  titleStyle: {
    marginTop: 50,
    alignItems: 'center',
  },
});
