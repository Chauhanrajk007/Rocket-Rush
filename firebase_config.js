// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyBqKv8bmLUQVrL3JXSfpiwi-cK2P3qh4_Q",
  authDomain: "rocket-rush-ae4b7.firebaseapp.com",
  projectId: "rocket-rush-ae4b7",
  storageBucket: "rocket-rush-ae4b7.firebasestorage.app",
  messagingSenderId: "950353232129",
  appId: "1:950353232129:web:8ae7ed0f3603d000c19b00",
  measurementId: "G-XZWDSXQLQS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();
firebase.auth().signInAnonymously();
