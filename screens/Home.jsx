import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../networkRequest/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [token, setToken] = useState('');
  const { logOut } = useAuth();
  

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

  return (
    <View style={{backgroundColor:'black', flex:1,}}>
      <Text style={{fontFamily:'Outfit-Bold'}}>{token ? `Token: ${token}` : 'Fetching token...'}</Text>
  <Text>  <Icon name="home-outline" size={30} color="#900" /></Text>


  <TouchableOpacity onPress={()=>{
    logOut();
  }}>
    <View style={{backgroundColor:'white' ,color:'black'}}><Text>Logout</Text></View>
  </TouchableOpacity>
    </View>
  );
}
