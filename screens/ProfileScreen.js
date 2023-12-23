import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    name: 'User Name',
    coverPhoto: 'https://via.placeholder.com/150',
    tags: ['Tag1', 'Tag2', 'Tag3'],
  });

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileData({ ...profileData, coverPhoto: result.uri });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      <Image source={{ uri: profileData.coverPhoto }} style={styles.coverPhoto} />
      <Text style={styles.name}>{profileData.name}</Text>
      <FlatList
        data={profileData.tags}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.tag}>{item}</Text>}
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
  coverPhoto: {
    width: '100%',
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  tag: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
});