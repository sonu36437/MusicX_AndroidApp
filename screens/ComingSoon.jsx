import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function ComingSoon() {
    const navigation = useNavigation();
  return (
    <View
    style={{backgroundColor:'black' ,flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{color:'white', fontFamily:'Outfit-Bold'}}> This screen will be Avalible Soon</Text>
      <TouchableOpacity style={{backgroundColor:'rgb(178, 255, 62)',padding:20 ,borderRadius:30 ,width:"50%", margin:20}} onPress={()=>{
        navigation.goBack();
        
      }}>
        <Text style={{color:'black', fontFamily:'Outfit-Bold',textAlign:'center'}}> Go back </Text>
      </TouchableOpacity>
    </View>
  )
}