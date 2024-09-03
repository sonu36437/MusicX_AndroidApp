import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebViewLogin from '../screens/WebViewLogin';
import Login from '../screens/Login';
import Home from '../screens/Home';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNav() {
  const { authToken } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authToken ? (
          <Stack.Screen name="Home" component={Home}  options={{ headerLargeTitle:true,title:'Home',headerBlurEffect:true }}/>
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
