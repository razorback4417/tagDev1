import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { getDocs, collection, query, orderBy, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

import { getAuth } from "firebase/auth";

import RNPickerSelect from 'react-native-picker-select';

export default function SearchScreen() {
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [taggersInfo, setTaggersInfo] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [displayTags, setDisplayTags] = useState(tags);

  const auth = getAuth();

  const dropoffLocations = [
    { label: 'LAX Airport', value: 'LAX Airport' },
    { label: 'Sawtelle', value: 'Sawtelle' },
    { label: 'K Town', value: 'K Town' },
    { label: 'Union Station', value: 'Union Station' },
    { label: 'Santa Monica', value: 'Santa Monica' },
    // Add more locations as needed
  ];


  const fetchTags = async () => {
    const tagsCol = collection(firestore, 'tags');
    const tagsSnapshot = await getDocs(isSorted ? query(tagsCol, orderBy('dropoffLocation')) : tagsCol);
    const tagsList = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTags(tagsList);
  };

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Successfully fetched user data:', userData);
        setUser(userData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [isSorted]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleSort = () => {
    setIsSorted(!isSorted);
  };

  const handleTagClick = async (tag) => {
    console.log('Tag clicked:', tag.userId)
    if (tag.riderSpace > 0) {
      const tagRef = doc(firestore, 'tags', tag.id);
      await updateDoc(tagRef, {
        riderSpace: tag.riderSpace - 1,
        taggers: arrayUnion(auth.currentUser.uid) // Add the current user to the taggers array
      });

      // Calculate the number of riders now
      const ridersNow = 4 - (tag.riderSpace - 1);

      // Fetch the taggers' information
      const taggersInfo = tag.taggers
      ? await Promise.all(tag.taggers.map(async (userId) => {
          const userDoc = await getDoc(doc(firestore, 'users', userId));
          return userDoc.data();
        }))
      : [];
      setTaggersInfo(taggersInfo);

      setModalVisible(true);

      // Fetch the tag owner's information
      const ownerDoc = await getDoc(doc(firestore, 'users', tag.userId));
      const ownerData = ownerDoc.data();
      console.log(ownerData)

      // Create an alert
      Alert.alert(
        "Tag Information",
        `Tag by: ${ownerData.firstName}\nRiders now: ${ridersNow}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Fetch the tags again after the alert is dismissed
              fetchTags();
            },
          },
        ]
      );
    }
  };

  const filteredTags = tags.filter(tag => tag.dropoffLocation.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>

      <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {taggersInfo.map((tagger, index) => (
                  <Text key={index}>Name: {tagger.firstName}, Phone: {tagger.phoneNumber}</Text>
                ))}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
        </Modal>

      <TextInput style={styles.input} placeholder="Search" onChangeText={handleSearch} value={searchText} />
      {/* <TouchableOpacity style={styles.button} onPress={handleSort}>
        <Text style={styles.buttonText}>Sort by Drop-off Location</Text>
      </TouchableOpacity> */}
      <RNPickerSelect
        onValueChange={(value) => {
          if (value !== null) {
            setSelectedLocation(value);
            const newDisplayTags = tags.filter(tag => tag.dropoffLocation === value);
            setDisplayTags(newDisplayTags);
          } else {
            setDisplayTags(tags);
          }
        }}
        items={dropoffLocations}
        placeholder={{ label: "Find by location", value: null }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: { ...styles.button, ...styles.buttonText },
          inputAndroid: { ...styles.button, ...styles.buttonText },
          placeholder: { color: 'white' }
        }}
      />
      <FlatList
        data={displayTags}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.tagInfo}>
              <Text style={styles.title}>{item.dropoffLocation}</Text>
              <Text style={styles.details}>
                {new Date(item.date.seconds * 1000).toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
              <Text style={styles.details}>{item.pickupLocation}</Text>
              <Text style={styles.details}>Rider Space: {item.riderSpace}</Text>
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.tagButton} onPress={() => handleTagClick(item)}>
                <Text style={styles.buttonText}>Tag</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  input: {
    height: 40,
    borderColor: '#00B386',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#00B386',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B386',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  tagInfo: {
    width: 300,
  },
  tagButton: {
    backgroundColor: '#00B386',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  buttonView: {
    marginRight: 10,
    justifyContent: 'center',
  }
});