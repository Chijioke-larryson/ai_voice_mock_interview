// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvmYlHjFlwnhejdfpxeHMMrY-UzKSRayg",
    authDomain: "larrysontutor.firebaseapp.com",
    projectId: "larrysontutor",
    storageBucket: "larrysontutor.firebasestorage.app",
    messagingSenderId: "431383545111",
    appId: "1:431383545111:web:1fa60930fe9f85ce396352",
    measurementId: "G-THK216GJ8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);