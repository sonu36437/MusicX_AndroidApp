import { View, StyleSheet ,StatusBar} from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './context/AuthContext';
import AppNav from './AppNav/AppNav';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from './context/AuthContext';



const Stack = createNativeStackNavigator();



export default function App() {
  return (
   
    // <AuthContextProvider>
     

    //   <AppNav />

 
 
    // </AuthContextProvider>
    <GestureHandlerRootView>
    <View style={{flex:1, backgroundColor:'red'}}>
      <AuthContextProvider>
      <StatusBar barStyle={'default'}/>
       <AppNav />
       </AuthContextProvider>
      

    </View>
    </GestureHandlerRootView>
  
  );
}


