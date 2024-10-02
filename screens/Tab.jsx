import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Fav from './Fav';
import SearchPage from './SearchPage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      backBehavior='firstRoute'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = "planet-sharp";
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Fav') {
            iconName = 'heart';
          }

          return (
            <Ionicons
              name={iconName}
              size={size + 8}
              color={color}
              style={{
                textAlign:'center',
                justifyContent:'center',
                width:90,
              
                borderWidth: focused ? 2 : 0, 
                // backgroundColor: focused ? 'grey' : 'transparent', 
                borderRadius: 50, 
                padding:5
            
                
              }}
            />
          );
        },
        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          height: 60,
          backgroundColor: 'black',
          position: 'absolute',
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0, // Remove the horizontal line
          transition: 'height 1s ease-in-out', 
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Outfit-Medium',
          textAlign: 'center',
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          // marginTop: 10,
        },
      })}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Fav"
        component={Fav}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}