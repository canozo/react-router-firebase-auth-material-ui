import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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

firebase.initializeApp(config);


const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/dashboard',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firebaseUI = uiConfig;
