import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function UserTags() {
  const navigation = useNavigation();
  const [tags, setTags] = useState([]);
  const auth = getAuth();

  const fetchUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(getFirestore(), 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Successfully fetched user data:', userData);
        return userData; // Return the user data
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      const db = getFirestore();
      const q = query(collection(db, 'tags'), where('taggers', 'array-contains', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const tags = await Promise.all(querySnapshot.docs.map(async doc => {
        const tag = doc.data();
        const taggersInfo = tag.taggers ? await Promise.all(tag.taggers.map(fetchUser)) : [];
        return { ...tag, taggersInfo };
      }));
      setTags(tags);
      console.log("TAGS", tags)
    };
    fetchTags();
  }, []);

  return (
    <View>
      <Button
        title="Go back"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={tags}
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
              <Text style={styles.details}>Taggers: {item.taggers.map(tagger => tagger.firstName).join(', ')}</Text>

                <Text style={styles.details}>Taggers:</Text>
                {item.taggers.map((tagger, index) => (
                  <Text key={index} style={styles.details}>
                    {tagger.firstName} ({tagger.email})
                  </Text>
                ))}
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