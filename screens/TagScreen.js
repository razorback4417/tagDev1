import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

export default function TagScreen() {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');

    const pickupLocations = [
        { label: 'Location 1', value: 'location1' },
        { label: 'Location 2', value: 'location2' },
        // Add more locations as needed
    ];

    const dropoffLocations = [
        { label: 'Location 1', value: 'location1' },
        { label: 'Location 2', value: 'location2' },
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

    const handleSubmit = () => {
        // Post data
        console.log('Date:', date);
        console.log('Pickup Location:', pickupLocation);
        console.log('Dropoff Location:', dropoffLocation);
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
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
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