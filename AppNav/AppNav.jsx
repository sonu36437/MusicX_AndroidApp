// AppNav.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebViewLogin from '../screens/WebViewLogin';
import MyTabs from '../screens/Tab'; // Import MyTabs correctly
import Login from '../screens/Login';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNav() {
  const { authToken } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authToken ? (
          <Stack.Screen 
            name="Tabs" 
            component={MyTabs} 
            options={{ headerShown: false,headerStyle:{backgroundColor:'red'} }} 

          />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewLogin" component={WebViewLogin} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}