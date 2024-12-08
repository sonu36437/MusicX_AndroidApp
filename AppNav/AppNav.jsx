import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebViewLogin from '../screens/WebViewLogin';
import MyTabs from '../screens/Tab';
import Login from '../screens/Login';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading'; 
import { PlayerContextProvider } from '../context/PlayerContext';
import Player from '../components/Player';
import TrackPlayer, { usePlaybackState, useProgress,Event } from 'react-native-track-player';
import PopUp from '../components/PopUp';
import{PopupContextProvider} from '../context/PopupContext'

const Stack = createNativeStackNavigator();

export default function AppNav() {
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [playingTrack,setPlayingTrack]=useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
    
      await new Promise(resolve => setTimeout(resolve, 500)); 

      setIsLoading(false);
    };

    checkAuthStatus();
  }, [authToken]);

  useEffect(() => {
   async function getActive(){
      const res= await TrackPlayer.getActiveTrack();
      console.log(res);
      
     if(res){
      setPlayingTrack(res);
     }
      
   }
   getActive();
  
  }, []);

  if (isLoading) {
    return <Loading />; 
  }

  return (
    <PopupContextProvider>
    <PlayerContextProvider>
    <NavigationContainer>
    <View style={{ flex: 1 }}>
  
   
   
      <Stack.Navigator>
        {authToken ? (
          <Stack.Screen 
            name="Tabs" 
            component={MyTabs} 
            options={{ headerShown: false, headerStyle: { backgroundColor: 'red' } }} 
          />
        
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewLogin" component={WebViewLogin} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
  {   authToken && <Player TrackDetail={playingTrack}/>}
      </View>
      <PopUp />
 
    </NavigationContainer>
     </PlayerContextProvider>
     </PopupContextProvider>
 
    
  );
}