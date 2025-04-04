import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import Home from './Home';
import Fav from './Fav';
import SearchPage from './SearchPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlaylistStackNavigator from './Playlists';
import Downloads from './Downloads';
import { useNavigation } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const navigation= useNavigation();
  return (

    <Tab.Navigator
    backBehavior="firstRoute"
    
    screenOptions={({ route }) => ({
      popToTopOnBlur: true,
      animation: 'shift',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
  
        if (route.name === 'Home') {
          iconName = 'planet-sharp';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Fav') {
          iconName = 'heart';
        } else if (route.name === 'playlists') {
          iconName = 'list';
        } else if (route.name === 'Downloads') {
          iconName = 'cloud-download';
        }
        return (
          <Ionicons
            name={iconName}
            size={size + 4}
            color={color}
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              width: 50,
              borderColor: '#7C4DFF',
              borderRadius: 25,
              backgroundColor: focused ? 'rgba(124, 233, 255, 0.1)' : 'transparent',
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}
          />
        );
      },
      tabBarActiveTintColor: 'rgb(178, 255, 62)',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarStyle: {
        height: 65,
        backgroundColor: 'black',
        position: 'absolute',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0,
        elevation: 8,
   
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontFamily: 'Outfit-Medium',
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: '600',
      },
      tabBarIconStyle: {
        position: 'relative',
        top: 0,
        marginTop: 5,
      },
      headerStyle: {
        backgroundColor: 'black', // Header background
      },
      contentStyle: {
        backgroundColor: 'black', // Screen background
      },
    })}
  >
  <Tab.Screen
  name="Home"
  component={Home}
  options={{
    headerShown: true,
    headerTintColor: 'white',
    headerTitleStyle: {
      fontFamily: 'Outfit-Bold',
    },
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
         
        navigation.navigate("settings")
        }}
        style={{ marginRight: 15 }} 
      >
        <Ionicons name="settings-outline" size={24} color="white" />
      </TouchableOpacity>
    ),
  }}
/>
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{ headerShown: false }}
        
      />
      <Tab.Screen
        name="Fav"
        component={Fav}
        options={{ headerShown: true,  headerStyle:{
          backgroundColor:'black',

        },
        headerTitle:"Liked Songs",
        headerTintColor:'white',
        headerTitleStyle:{
          fontFamily:'Outfit-Bold'
        }, }}
      />
      <Tab.Screen
        name="playlists"
        component={PlaylistStackNavigator}
        options={{ headerShown: false }}></Tab.Screen>
        <Tab.Screen
        name="Downloads"
        component={Downloads}
        options={{headerShown:true,
          headerStyle:{
            backgroundColor:'black',

          },
          headerTintColor:'white',
          headerTitleStyle:{
            fontFamily:'Outfit-Bold'
          },
          
          
          
        }}
        />
    </Tab.Navigator>
  );
}