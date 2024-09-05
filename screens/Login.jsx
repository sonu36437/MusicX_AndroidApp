import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
    <Text style={{fontFamily:'Outfit-Bold', fontSize:30,color:'#8AAAE5'}}>
    <Text style={{color:'#8AAAE5'}}>L</Text>
    ogin with Spotify</Text>
    <Text style={{textAlign:'center',fontFamily:'Outfit-Regular',fontSize:17,color:'#8AAAE5'}}>Lets deep dive into the world of high quality music</Text>
    <Pressable
     style={{backgroundColor:'#8AAAE5',padding:20,borderRadius:40,marginTop:30,width:'50%'}}
     onPress={()=>{navigation.navigate('WebViewLogin')}}
    
    
    >
        <Text style={{textAlign:'center',fontFamily:'Outfit-Bold',fontSize:20,color:'white'}}>Login</Text>
    </Pressable>
    </View>
  )
}   
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'black',
        justifyContent:'center'

    }
})