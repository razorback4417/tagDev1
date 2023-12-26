import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

export default function SearchScreen() {
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCol = collection(firestore, 'tags');
      const tagsSnapshot = await getDocs(isSorted ? query(tagsCol, orderBy('dropoffLocation')) : tagsCol);
      const tagsList = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTags(tagsList);
    };

    fetchTags();
  }, [isSorted]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleSort = () => {
    setIsSorted(!isSorted);
  };

  const handleTagClick = async (tag) => {
    console.log("here")
    console.log("tag", tag.date)
    if (tag.riderSpace > 0) {
      console.log("here1")
      const tagRef = doc(firestore, 'tags', tag.id);
      await updateDoc(tagRef, { riderSpace: tag.riderSpace - 1 });

      // Calculate the number of riders now
      const ridersNow = 4 - (tag.riderSpace - 1);

      // Create an alert
      Alert.alert(
        "Tag Information",
        `Owner: ${tag.owner}\nRiders now: ${ridersNow}`,
        [{ text: "OK" }]
      );
    }
  };

  const filteredTags = tags.filter(tag => tag.dropoffLocation.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Search" onChangeText={handleSearch} value={searchText} />
      <View style={styles.button}>
        <Button title="Sort by Drop-off Location" onPress={handleSort} color="#00B386" />
      </View>
      <FlatList
        data={filteredTags}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.dropoffLocation}</Text>
            <Text style={styles.details}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text style={styles.details}>{item.pickupLocation}</Text>
            <Text>Rider Space: {item.riderSpace}</Text>
            <Button title="Tag" onPress={() => handleTagClick(item)} />
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
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
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
});