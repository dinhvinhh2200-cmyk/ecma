// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByvX7HRoCClDJvzijLlfABFNoWsAp9gLo",
  authDomain: "assmecma.firebaseapp.com",
  projectId: "assmecma",
  storageBucket: "assmecma.firebasestorage.app",
  messagingSenderId: "849940343844",
  appId: "1:849940343844:web:d716ff628bafb3a0b63cb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);