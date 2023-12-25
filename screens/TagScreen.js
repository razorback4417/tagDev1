import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import { addDoc, collection } from "firebase/firestore";
import { auth, firestore } from '../firebaseConfig'; // import firestore from firebaseConfig.js

export default function TagScreen() {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');

    const pickupLocations = [
        { label: 'Carnasale Commons', value: 'Carnasale Commons' },
        { label: 'Luskin Hotel', value: 'Luskin Hotel' },
        { label: 'Rieber Courts', value: 'Rieber Courts' },
        // Add more locations as needed
    ];

    const dropoffLocations = [
        { label: 'LAX Airport', value: 'LAX Airport' },
        { label: 'Sawtelle', value: 'Sawtelle' },
        { label: 'K Town', value: 'K Town' },
        { label: 'Union Station', value: 'Union Station' },
        { label: 'Santa Monica', value: 'Santa Monica' },
        // Add more locations as needed
    ];

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    // const handleSubmit = () => {
    //     // Post data
    //     console.log('Date:', date);
    //     console.log('Pickup Location:', pickupLocation);
    //     console.log('Dropoff Location:', dropoffLocation);
    // };

    const handleSubmit = async () => {

        const tagFormData = {
          date,
          pickupLocation,
          dropoffLocation,
          // Add other form fields here
          userId: auth.currentUser.uid, // Add the user's UID to the form data
        };
        console.log('tagFormData: ', tagFormData);

        try {
          // Add a new document to the 'tags' collection with the tag form data

          const docRef = await addDoc(collection(firestore, 'tags'), tagFormData);

          // The tag form data has been saved in Firestore
          console.log('Tag form data saved successfully. Document ID: ', docRef.id);
        } catch (error) {
          console.error('Error saving tag form data: ', error);
        }
      };

      return (
        <View style={styles.container}>
          <Button onPress={showDatepicker} title="Show date picker!" />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'datetime'}
              display="default"
              onChange={onChange}
            />
          )}
          <Text style={styles.label}>Pickup Location:</Text>
          <RNPickerSelect
            onValueChange={value => setPickupLocation(value)}
            items={pickupLocations}
          />
          <Text style={styles.label}>Dropoff Location:</Text>
          <RNPickerSelect
            onValueChange={value => setDropoffLocation(value)}
            items={dropoffLocations}
          />
          <Button onPress={handleSubmit} title="Submit" />
        </View>
      );

    // return (
    //     <View style={styles.container}>
    //         <Button onPress={showDatepicker} title="Show date picker!" />
    //         {show && (
    //             <DateTimePicker
    //                 testID="dateTimePicker"
    //                 value={date}
    //                 mode={'datetime'}
    //                 display="default"
    //                 onChange={onChange}
    //             />
    //         )}
    //         <Text style={styles.label}>Pickup Location:</Text>
    //         <RNPickerSelect
    //             onValueChange={value => setPickupLocation(value)}
    //             items={pickupLocations}
    //         />
    //         <Text style={styles.label}>Dropoff Location:</Text>
    //         <RNPickerSelect
    //             onValueChange={value => setDropoffLocation(value)}
    //             items={dropoffLocations}
    //         />
    //         <Button title="Submit" onPress={handleSubmit} />
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginTop: 20,
    },
});