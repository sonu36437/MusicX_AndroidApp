import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebViewLogin from '../screens/WebViewLogin';
import MyTabs from '../screens/Tab';
import Login from '../screens/Login';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading'; 

const Stack = createNativeStackNavigator();

export default function AppNav() {
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
    
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [authToken]);

  if (isLoading) {
    return <Loading />; 
  }

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}