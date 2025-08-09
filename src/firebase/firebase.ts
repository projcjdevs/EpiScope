// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPelQ6a2F7B3lB_W8ClWefXF4aphu-MSI",
  authDomain: "disease-mlweb.firebaseapp.com",
  projectId: "disease-mlweb",
  storageBucket: "disease-mlweb.firebasestorage.app",
  messagingSenderId: "274546185995",
  appId: "1:274546185995:web:64a327686edaaa7486b40e",
  measurementId: "G-MTBZ8EGZ9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);