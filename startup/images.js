// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD91iGeFpXffOoGs9WJPXIBNy1E21bBuYo",
  authDomain: "campus-mart-7e4d0.firebaseapp.com",
  projectId: "campus-mart-7e4d0",
  storageBucket: "campus-mart-7e4d0.appspot.com",
  messagingSenderId: "581578995493",
  appId: "1:581578995493:web:90790878863173a1434ccc",
  measurementId: "G-ZMPDYHR59R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
