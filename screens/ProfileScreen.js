import { StyleSheet, Image, Button, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDoc, doc } from "firebase/firestore";
import { auth, firestore } from '../firebaseConfig'; // import auth and firestore

import * as ImagePicker from 'expo-image-picker';

import Icon from 'react-native-vector-icons/FontAwesome';

import { getFirestore, updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  const handleUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, 'profilePictures/' + result.uri.split('/').pop());

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            // Update image state
            setImageUrl(downloadURL);

            // Update user document with profile picture URL
            const userRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
              profilePicture: downloadURL,
            });
          });
        }
      );
    }
  };

  // const handleUpload = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImageUrl(result.uri);

  //     const response = await fetch(result.uri);
  //     const blob = await response.blob();

  //     const storage = getStorage();
  //     const storageRef = ref(storage, 'profilePictures/' + result.uri.split('/').pop());

  //     const uploadTask = uploadBytesResumable(storageRef, blob);

  //     uploadTask.on('state_changed',
  //       (snapshot) => {
  //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //       },
  //       (error) => {
  //         console.error('Upload failed:', error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           console.log('File available at', downloadURL);
  //           // Update image state
  //           setImageUrl(downloadURL);
  //         });
  //       }
  //     );
  //   }
  // };


  // return (
  //   <View style={styles.container}>
  //     {imageUrl ?
  //         <Text style={styles.label}>Edit profile picture:</Text> :
  //         <Text style={styles.label}>Upload a profile picture:</Text>
  //       }
  //       <Button title="Select Image" onPress={handleUpload} />
  //       {imageUrl &&
  //         <Image
  //           source={{ uri: imageUrl }}
  //           style={{
  //             width: 200,
  //             height: 200,
  //             borderRadius: 100, // This will make the image circular
  //             alignSelf: 'center', // This will center the image horizontally
  //           }}
  //         />
  //       }
  //     <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</Text>
  //     <Text style={styles.info}>{user ? formatPhoneNumber(user.phoneNumber) : 'Loading...'}</Text>
  //     <Text style={styles.info}>{user ? user.email : 'Loading...'}</Text>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user && user.profilePicture ? user.profilePicture : 'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg' }}
          style={styles.profileImage}
        />
        <Icon name="pencil" size={30} color="#000" style={styles.editIcon} onPress={handleUpload} />
      </View>
      <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</Text>
      <Text style={styles.info}>{user ? formatPhoneNumber(user.phoneNumber) : 'Loading...'}</Text>
      <Text style={styles.info}>{user ? user.email : 'Loading...'}</Text>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 10,
//   },
//   info: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 10,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#3498db',
//     color: '#fff',
//     padding: 10,
//     borderRadius: 5,
//   },
// });