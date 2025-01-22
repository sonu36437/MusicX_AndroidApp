import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated,Modal } from 'react-native';
import { PopupContext } from '../context/PopupContext'; 
import PopUpContent from './PopUpContent';
import Blurvw from './Blurvw';

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
        duration: 900,
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
    <Modal animationType="slide" transparent={true} statusBarTranslucent={true} onRequestClose={() => {
      setPopup(false);
    }}>
      <TouchableWithoutFeedback onPress={() => setPopup(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={{
              position:'absolute', 
              bottom:0, 
              width:"100%", 
       
              paddingBottom:40, 
              height:400,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 25,
              overflow:'hidden'
              
        
            
            }}>
              <Blurvw imageUrl={popupContent?.image}/>
              {console.log(popupContent)
              }
           
              <View style={[StyleSheet.absoluteFill]}>
                   <PopUpContent content={popupContent}/>

              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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

    borderTopColor:'white',
    borderWidth:1,
    height: '40%',
    width: '100%', backgroundColor: 'black',
    padding: 20,

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
