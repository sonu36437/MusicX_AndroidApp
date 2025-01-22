import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useCallback ,useContext} from 'react';
import { addToLikedList, fetchTracks, removeFromLikedList } from '../networkRequest/spotifyRequest';
import { useNavigation } from '@react-navigation/native';
import { PopupContext } from '../context/PopupContext';
import { checkIfDownloaded, deleteDownloadedSong, downloadSong } from '../networkRequest/DownloadSongs';



export default function PopUpContent({ content }) {
  const [isLiked, setIsLiked] = useState(false);
  const [checkDownloaded,setcheckDownloaded]=useState(false);
  const [checkIsLiked, setCheckLiked] = useState(false);

  const {setPopup} = useContext(PopupContext);
  const navigation = useNavigation();
  const handleSongStatus=async()=>{
  
    
   
    if(isLiked===null)return;
    console.log(isLiked);
    
    
   if (isLiked===false){
    
    const res= await addToLikedList(content.id);
    console.log(res);
    setIsLiked(true);

    return;
  }
  else{
       const res=await removeFromLikedList(content.id);
      
       setIsLiked(false);
       console.log("removed");
       return;
  }


  }


  const buttons = [
    {
      id: 'favorite',
      title: checkIsLiked ? '.....' : (isLiked ? 'Remove from Favourites' : 'Add to Favourites'),
      onPress: handleSongStatus,
      textColor: isLiked ? 'rgb(255, 0, 0)' : 'rgb(0, 150, 0)',
      fontFamily: 'Outfit-Bold'
    },
    
    {
      id: 'playlist',
      title: 'Add To Playlist',
      onPress: () => {
        setPopup(false);
        navigation.navigate('ComingSoon');
      },
      textColor: 'black',
      fontFamily: 'Outfit-Medium'
    },
    {
      id: 'artist',
      title: 'View more by Artist',
      onPress: () => {
        setPopup(false);
        navigation.navigate('ComingSoon');
      },
      textColor: 'black',
      fontFamily: 'Outfit-Medium'
    },
   { id:'download',
    title: checkDownloaded?"remove form downloads":'Download',
    onPress: () => {
      // setPopup(false);
    { !checkDownloaded? downloadSong(content):deleteDownloadedSong(content.id)}
    setPopup(false);

    },
    textColor: 'black',
    
    fontFamily: 'Outfit-Medium'
   }
  ];

  const isliked = useCallback(async () => {
    setCheckLiked(true);
    const res = await fetchTracks(`https://api.spotify.com/v1/me/tracks/contains?ids=${content.id}`);
    setCheckLiked(false);
    setIsLiked(res[0]);
  }, [content.id]);
  const isDownloaded =useCallback(async()=>{
    console.log("lsdjflsdjfljsdofjsdjflsdjfljsdlfjsldjflsdjflsjdlfj");
    
    const res=await checkIfDownloaded(content.id);
    setcheckDownloaded(res);
  })
  
  

  useEffect(()=>{

    isliked();
   isDownloaded();
  },[content.id])
 

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
        <View style={styles.imageStyle}>
          <Image
            source={{ uri: `${content.image}` }}
            style={{borderRadius:10, marginTop:10}}
            height={80}
            width={80}
          />
        </View>
      </View>
      <View style={styles.titleStyle}>
        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 20, color: 'rgba(0,0,0,0.7)' }} numberOfLines={3}>
          {content.title}
        </Text>
      </View>
      <View style={{ marginTop: 0, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: 'rgba(0,0,0,0.6)' }} numberOfLine={2}>
          {content.artist}
        </Text>
      </View>
      
      {buttons.map((button) => (
        <TouchableOpacity 
          key={button.id}
          onPress={button.onPress} 
          style={{justifyContent:'center', alignItems:'center'}}
        >
          <View style={styles.buttonContainer}>
            <Text 
              style={{ 
                fontFamily: button.fontFamily, 
                fontSize: 14, 
                color: button.textColor 
              }} 
              numberOfLines={1}
            >
              {button.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: 20,
    shadowColor: 'white',
  },
  titleStyle: {
    alignItems: 'center',
    color:'black',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '90%'
  }
});
