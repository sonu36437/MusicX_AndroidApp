import React from 'react';
import { View, TextInput, StyleSheet,Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchPage() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={{color:'white', textAlign:'center', margin:30,fontFamily:'Outfit-Bold', fontSize:25}} >Search for songs or Artists</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="search for songs......."
          placeholderTextColor="black" 
          
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 5,
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 3,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily:'Outfit-Medium',
    color: 'black',
  }
});