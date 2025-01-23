import { View, Text, useWindowDimensions,Image, StyleSheet } from 'react-native'
import React, { useEffect, useMemo } from 'react'


export default function Blurvw({imageUrl, blurAmount=80}) {
    // Memoize the image URL to prevent unnecessary re-fetching
    const memoizedImageUrl = useMemo(() => imageUrl || "https://i.scdn.co/image/ab67616d0000b273c1b12ad55c27bf87fce44489", [imageUrl]);
 
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        console.log('mounted');
        return () => {
      
          
            console.log('unmounted');
        };
    }, [memoizedImageUrl]);

  
   

    return (
        <View style={{ flex: 1 }}>
            
            <Image 
                source={{uri:memoizedImageUrl}}
                width={width} 
                height={height}
                blurRadius={200}
            />
            
           
              
         
          
        </View>
    )
}