
import { initializeApp, getApps,getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import  {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
 const firebaseConfig={
    apiKey: "AIzaSyCvmYlHjFlwnhejdfpxeHMMrY-UzKSRayg",
    authDomain: "larrysontutor.firebaseapp.com",
    projectId: "larrysontutor",
    storageBucket: "larrysontutor.firebasestorage.app",
    messagingSenderId: "431383545111",
    appId: "1:431383545111:web:1fa60930fe9f85ce396352",
    measurementId: "G-THK216GJ8T"
};

// Initialize Firebase
const app =!getApps.length ?  initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export  const db = getFirestore(app);