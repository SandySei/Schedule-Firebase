// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLb8k91fNlNHavR2A-ipDPK1_ZEMhBgmg",
  authDomain: "projeto06-8e05a.firebaseapp.com",
  projectId: "projeto06-8e05a",
  storageBucket: "projeto06-8e05a.appspot.com",
  messagingSenderId: "663243503114",
  appId: "1:663243503114:web:9b72d47fe9c989a29b11f3",
  measurementId: "G-BEX4FFDKK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = getFirestore(app);
