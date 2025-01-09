import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { PopupContext } from '../context/PopupContext'; 
import PopUpContent from './PopUpContent';

export default function PopUp() {
  const { popup, setPopup, popupContent, setPopupContent } = useContext(PopupContext);
  const slideAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    if (popup) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [popup]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0], 
  });

  if (!popup) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setPopup(false)}>
        <View style={styles.translucentBackground} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.content, { transform: [{ translateY }] }]}>
        <PopUpContent content={popupContent} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex:1000
  
  },
  translucentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, 0.7)',
  },
  content: {
    position: 'absolute',
   
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    // borderLeftColor:'white',
    // borderRightColor:'white',
    borderTopColor:'white',
    borderWidth:1,
    height: '40%',
    width: '100%', backgroundColor: 'black',
    padding: 20,

  },
});
