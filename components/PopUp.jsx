import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { PopupContext } from '../context/PopupContext'; // Import the context
import PopUpContent from './PopUpContent';

export default function PopUp() {


  const { popup, setPopup, popupContent, setPopupContent } = useContext(PopupContext);
  if (!popup) {
    return null;
  }



  return (
   
      <View style={styles.container}>
         <TouchableWithoutFeedback onPress={() => setPopup(false)}>
        <View style={styles.translucentBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.content}>
          <PopUpContent content={popupContent} />
        </View>
      </View>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container full screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  translucentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255, 0.2)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: '40%',
    width: '100%', backgroundColor: 'black',
    padding: 20,

  },
});







