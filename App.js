import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoadingScreen from './LoadingScreen';
import SearchScreen from './SearchScreen';
import TagScreen from './TagScreen';
import ProfileScreen from './ProfileScreen';
import LoginRegisterScreen from './LoginRegisterScreen'; // Import the LoginRegisterScreen

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a new state variable for tracking login status

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000); // loading for 4 seconds
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <LoginRegisterScreen onLogin={() => setIsLoggedIn(true)} />; // Show the LoginRegisterScreen if not logged in
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Search"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Search') {
              iconName = focused ? 'ios-search' : 'ios-search-outline';
            } else if (route.name === 'Tag') {
              iconName = focused ? 'ios-pricetag' : 'ios-pricetag-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Tag" component={TagScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}