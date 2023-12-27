import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';

import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoadingScreen from './screens/LoadingScreen';
import SearchScreen from './screens/SearchScreen';
import TagScreen from './screens/TagScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginRegisterScreen from './screens/LoginRegisterScreen'; // Import the LoginRegisterScreen
import UserTags from './screens/UserTags'; // import the UserTags screen


import { LogBox } from 'react-native';

import { auth } from './firebaseConfig'; // import auth from firebaseConfig.js
import { onAuthStateChanged } from 'firebase/auth';

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserTags" component={UserTags} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a new state variable for tracking login status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // The user is signed in.
        setIsLoggedIn(true);
      } else {
        // No user is signed in.
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // loading for 4 seconds
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
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Tag" component={TagScreen} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}