export default firebase;

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB4WPk0WGWBRxrj4qIAOo80q0Gptf6YPeo",
    authDomain: "tagapp-dc074.firebaseapp.com",
    projectId: "tagapp-dc074",
    storageBucket: "tagapp-dc074.appspot.com",
    messagingSenderId: "136338763975",
    appId: "1:136338763975:ios:d7bec3d20ac202b1290ee2"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
