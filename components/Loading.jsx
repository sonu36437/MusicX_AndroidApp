
import React from 'react';
import { View, ActivityIndicator, StyleSheet,Text } from 'react-native';

export default function Loading({size='large',color="white",message="Loading"}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={{color:'white',fontFamily:'Outfit-Bold'}}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
 
    backgroundColor:'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});