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
        tabBarActiveTintColor: 'yellow',
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
          shadowColor: '#000',
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