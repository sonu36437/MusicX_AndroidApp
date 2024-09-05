import { View, StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContextProvider } from './context/AuthContext';
import AppNav from './AppNav/AppNav';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <View style={styles.container}>
        <AppNav />
      </View>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
});