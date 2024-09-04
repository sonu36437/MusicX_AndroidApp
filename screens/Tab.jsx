// MyTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Fav from './Fav';
import SearchPage from './SearchPage';
import Ionicons from '@react-native-vector-icons/Ionicons'; // Make sure the path is correct

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchPage') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Fav') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="SearchPage"
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