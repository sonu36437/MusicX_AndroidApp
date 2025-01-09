import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
    <Text style={{fontFamily:'Outfit-Bold', fontSize:30,color:'white'}}>
    <Text style={{color:'white'}}>L</Text>
    ogin with Spotify</Text>
    <Text style={{textAlign:'center',fontFamily:'Outfit-Regular',fontSize:17,color:'white'}}>Lets deep dive into the world of high quality music</Text>
    <Pressable
     style={{backgroundColor:'rgb(178, 255, 62)',padding:20,borderRadius:40,marginTop:30,width:'50%'}}
     onPress={()=>{navigation.navigate('WebViewLogin')}}
    
    
    >
        <Text style={{textAlign:'center',fontFamily:'Outfit-Bold',fontSize:20,color:'black'}}>Login</Text>
    </Pressable>
    </View>
  )
}   
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'black',
        justifyContent:'center',
        shadowColor:'red',
        shadowOffset:{width:0,height:2},
        elevation:2

    }
})