import { StyleSheet, Image, Button, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from '../firebaseConfig'; // import auth and firestore

// import { query, where, getDocs, collection } from "firebase/firestore";

import { getAuth, getUser } from "firebase/auth";



export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
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
    fetchUser();
    // getTagFormDataForUser(auth.currentUser.uid);
    // console.log('Current user email:', auth.currentUser.email);
  }, []);

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, 'profilePictures/' + auth.currentUser.uid);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle the upload progress
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</Text>
      <Text style={styles.info}>{user ? formatPhoneNumber(user.phoneNumber) : 'Loading...'}</Text>
      <Text style={styles.info}>{user ? user.email : 'Loading...'}</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <Button title="Upload Profile Picture" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});