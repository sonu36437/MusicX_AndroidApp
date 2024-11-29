import 'react-native-gesture-handler'
import { View, Text, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import { getAuthToken } from '../networkRequest/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import BufferingIcon from '../components/BufferingIcon';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './Login';
import { NavigationContainer } from '@react-navigation/native';

export function Check(){
  return(
    <Text>myText</Text>
  )
}

export default function Home() {
  const [token, setToken] = useState('');
  const { logOut } = useAuth();
  const Drawer = createDrawerNavigator();
  

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

      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
          
            fontFamily:'Outfit-Bold',
            color:'white'
          },
        }}
      >
        <Drawer.Screen 
          name="HomeScreen" 
          component={HomeContent}
          options={{
            title: 'Home',
          
          
           
          }}
        />
      </Drawer.Navigator>
   
  );
}

function HomeContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'black' }}>
      <Text style={{ fontSize: 24,fontFamily:'Outfit-Medium',color:'white' }}>Welcome to the Home Screen!</Text>
     
    </View>
  );
}
