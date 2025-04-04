import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext } from 'react';
import { deleteAllSongs } from '../networkRequest/DownloadSongs';
import { useAuth } from '../context/AuthContext';


export default function SettingsScreen() {
  const {logOut} =useAuth();
 

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "You will lose all your downloads. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          onPress: async () => {
           await deleteAllSongs();
           logOut();
            console.log("Deleting all songs...");
         
          }
        }
      ]
    );
  };

  const buttonsArray = [
    { name: 'Logout', color: 'red', func: handleLogout },
  ];

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
      {buttonsArray.map((button, index) => (
        <TouchableOpacity
          key={index}
          onPress={button.func}
          style={{
            backgroundColor: button.color,
            padding: 10,
            borderRadius: 8,
            margin: 5,
            width: "100%",
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Outfit-Bold', fontSize: 20 }}>
            {button.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
