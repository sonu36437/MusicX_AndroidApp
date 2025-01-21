import 'react-native-gesture-handler'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';

import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../networkRequest/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import BufferingIcon from '../components/BufferingIcon';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './Login';
import { NavigationContainer } from '@react-navigation/native';
import Homedata from '../networkRequest/HomeScreenData';
import { Dimensions } from 'react-native';
import Test from '../components/Blurvw';

const {width,height}= Dimensions.get('window')


const NewSongList=({data})=>{
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({ item }) => (
        <TouchableOpacity style={{shadowColor:'white',elevation:60}}>
        <View style={{ height: height / 3, width: width / 2 ,margin:10 }}>
          <Image
            source={{ uri: item.album.images[0].url }}
            style={{ width: "100%", height: "80%", borderRadius: 30 }}
          />
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Outfit-Medium'}} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        </TouchableOpacity>
       
      )}
      keyExtractor={(item) => item.id}
    />
  
  )

}


export default function Home() {
  const [token, setToken] = useState('');
  const { logOut } = useAuth();
  const [newTracks,setNewTracks]=useState(null);

  

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAuthToken();
        setToken(token);
        console.log("Token fetched:", token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []); 

  const getHomeData=async()=>{
   const response= await Homedata.getNewTracks();
 setNewTracks(response)


  }
  useEffect(()=>{
    getHomeData();
    Homedata.getUserTopSongs();

  },[])

  

 



  return (
    <View style={{ flex: 1, backgroundColor:'black' ,widht:"100%"}}>
      <View style={{padding:20}}><Text style={{color:'white',fontFamily:'Outfit-Bold', fontSize:22 }}>Home</Text></View>
       <View style={{paddingTop:10}} >
        <Text style={{color:'white', fontFamily:'Outfit-Medium', fontSize:18,padding:10}}>New Releases</Text>
       <NewSongList data={newTracks} />
       </View>
       <Test/>
   
       
    
     
    </View>
  );
}

