import React, { useState } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, Text } from 'react-native';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([
    { id: '1', text: 'Item 1', image: 'https://via.placeholder.com/150' },
    { id: '2', text: 'Item 2', image: 'https://via.placeholder.com/150' },
    // Add more items here
  ]);

  const filteredData = data.filter(item => item.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text>{item.text}</Text>
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
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
  },
});