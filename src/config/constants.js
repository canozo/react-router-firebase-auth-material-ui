import firebase from 'firebase';

// Required for side-effects
require('firebase/firestore');


const config = {
  apiKey: "AIzaSyBNnu333V_TotUPnwc1TiL8MxKvO2A0U_c",
  authDomain: "examen-1-e9ea2.firebaseapp.com",
  databaseURL: "https://examen-1-e9ea2.firebaseio.com",
  projectId: "examen-1-e9ea2",
  storageBucket: "examen-1-e9ea2.appspot.com",
  messagingSenderId: "1044383981280"
};

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/dashboard',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export default firebase.initializeApp(config);
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firebaseUI = uiConfig;
