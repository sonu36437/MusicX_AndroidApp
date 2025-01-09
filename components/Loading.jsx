
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});