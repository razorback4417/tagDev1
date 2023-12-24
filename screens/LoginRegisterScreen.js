import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // import auth from firebaseConfig.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { firestore } from '../firebaseConfig'; // import firestore from firebaseConfig.js

export default function LoginRegisterScreen(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Check if email and password fields are not empty
    if (!email || !password) {
      Alert.alert('Invalid input', 'Email and password fields cannot be empty');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The user is now signed in.
      // Call onLogin prop to set isLoggedIn to true in App.js
      props.onLogin();
    } catch (error) {
      Alert.alert('Invalid input', error.message || 'Invalid email or password');
      console.error(error);
      // There was an error signing in.
    }
  };

  const handleRegister = async () => {
    // Check if all fields are filled out
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      Alert.alert('Missing fields', 'All fields are required for registration');
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email');
      return;
    }

    // Check if email ends with ".edu"
    if (!email.endsWith('.edu')) {
      Alert.alert('Invalid email', 'Email must end with ".edu"');
      return;
    }

    // Validate phone number
    const phoneNumberRegex = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
    Alert.alert('Invalid phone number', 'Phone number must be in the format XXX-XXX-XXXX or XXXXXXXXXX');
    return;
    }

    // Handle register
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // The user has been registered and is now signed in.

      // Save additional user information in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      // Call onLogin prop to set isLoggedIn to true in App.js
      props.onLogin();
    } catch (error) {
      console.error(error);
      // There was an error registering the user.
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLogin ? (
        <Button title="Login" color="tomato" onPress={handleLogin} />
      ) : (
        <Button title="Register" color="tomato" onPress={handleRegister} />
      )}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'tomato',
  },
  input: {
    height: 40,
    borderColor: 'tomato',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  switchText: {
    marginTop: 10,
    color: 'tomato',
    textAlign: 'center',
  },
});