// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX5BCIaNZrWZxR1l2qvYmmpreyPlGcdwo",
  authDomain: "inscription-2089c.firebaseapp.com",
  projectId: "inscription-2089c",
  messagingSenderId: "936892592945",
  appId: "1:936892592945:web:af222a24a52d0a33727610"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = getAuth(app);