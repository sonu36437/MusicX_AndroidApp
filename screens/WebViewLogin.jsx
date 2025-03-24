import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import { useAuth } from '../context/AuthContext';


const WebViewLogin = ({navigation}) => {
  const webViewRef = useRef(null);
  const { saveAuthToken } = useAuth();

  // useEffect(() => {
  //   const getToken = async () => {
  //     try {
  //       const tokenString = await AsyncStorage.getItem('sp_dc');
  //       if (tokenString) {
  //         const token = JSON.stringify(tokenString); // Parse the token back to object if necessary
  //         console.log('Retrieved token:', token);
  //         Alert.alert('Retrieved Token', token);
  //       } else {
  //         console.log('No token found');
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving token:', error);
  //     }
  //   };

  //   getToken();
  // }, []);

  const onNavigationStateChange = async (navState) => {
    const { url } = navState;
    const exp = /https:\/\/accounts\.spotify\.com\/.+\/status/;

    if (exp.test(url)) {
      try {
     
        const cookies = await CookieManager.get(url);
        console.log('Retrieved cookies:', cookies);
        console.log("sp_dc",cookies.sp_dc.value)

      
        const cookiesString = JSON.stringify(cookies.sp_dc.value);
        
   
        await AsyncStorage.setItem('sp_dc', cookiesString);
        await AsyncStorage.setItem('sp_t',cookies?.sp_t?.value);
        await AsyncStorage.setItem('sp_key',cookies?.sp_key?.value);
        saveAuthToken(cookiesString)

        navigation.navigate('Home');

        // Alert.alert('Cookies:', cookiesString);
      } catch (error) {
        console.error('Error retrieving cookies:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://accounts.spotify.com/' }}
        onNavigationStateChange={onNavigationStateChange}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewLogin;
