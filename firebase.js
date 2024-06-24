// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN24sbOUDPzc40yc7R_k5Tn1p2KXg7FqE",
  authDomain: "rozgar-dhaba-1c9b8.firebaseapp.com",
  projectId: "rozgar-dhaba-1c9b8",
  storageBucket: "rozgar-dhaba-1c9b8.appspot.com",
  messagingSenderId: "823919844465",
  appId: "1:823919844465:web:bc8f225299fe7143f10fd0",
  measurementId: "G-GEBLZ38CZ2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
