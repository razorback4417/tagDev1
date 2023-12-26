import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
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

    const handleSubmit = async () => {
        console.log("asljdhflakjsdfkjahsdkfhj")
        const tagFormData = {
          date,
          pickupLocation,
          dropoffLocation,
          userId: auth.currentUser.uid,
          riderSpace: 3,
          taggers: [auth.currentUser.uid],
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
          <Text style={styles.title}>Create a Tag</Text>
          <Text style={styles.label}>Time Leaving:</Text>
          <View style={styles.dateTimePickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'datetime'}
              display="default"
              onChange={onChange}
            />
          </View>
          <Text style={styles.label}>Pickup Location:</Text>
          <RNPickerSelect
            onValueChange={value => setPickupLocation(value)}
            items={pickupLocations}
            style={pickerSelectStyles}
          />
          <Text style={styles.label}>Dropoff Location:</Text>
          <RNPickerSelect
            onValueChange={value => setDropoffLocation(value)}
            items={dropoffLocations}
            style={pickerSelectStyles}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      );

      // return (
      //   <View style={styles.container}>
      //     <Button onPress={showDatepicker} title="Show date picker." />
      //     {show && (
      //       <DateTimePicker
      //         testID="dateTimePicker"
      //         value={date}
      //         mode={'datetime'}
      //         display="default"
      //         onChange={onChange}
      //       />
      //     )}
      //     <Text style={styles.label}>Pickup Location:</Text>
      //     <RNPickerSelect
      //       onValueChange={value => setPickupLocation(value)}
      //       items={pickupLocations}
      //     />
      //     <Text style={styles.label}>Dropoff Location:</Text>
      //     <RNPickerSelect
      //       onValueChange={value => setDropoffLocation(value)}
      //       items={dropoffLocations}
      //     />
      //     <Button onPress={handleSubmit} title="Submit" />
      //   </View>
      // );

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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00B386',
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00B386',
  },
  dateTimePicker: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00B386',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateTimePickerContainer: {
    paddingTop: 10,
    alignSelf: 'flex-start',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});