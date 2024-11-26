import { View, StyleSheet,AppState } from 'react-native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContextProvider } from './context/AuthContext';
import AppNav from './AppNav/AppNav';
import { useAuth } from './context/AuthContext';



const Stack = createNativeStackNavigator();


export default function App() {
  useEffect(()=>{
  console.log("app mounted");
  
  return ()=>{
    console.log("app unmounted");
  }
  },[])

 
  


  return (
    
    <AuthContextProvider>
   
      
     
  
      <AppNav />
     
   
  
      </AuthContextProvider>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});