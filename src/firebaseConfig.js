// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (using the data you provided)
const firebaseConfig = {
  // NOTE: This is a simplified config from your mobile JSON.
  // For a React Web App, the config usually looks like this:
  apiKey: "AIzaSyA8JugptVZxJhvkCGlKahNBVVPYSdCii5U", 
  authDomain: "doc-nutri-calci.firebaseapp.com",
  projectId: "doc-nutri-calci",
  storageBucket: "doc-nutri-calci.firebasestorage.app",
  messagingSenderId: "619217370430",
  appId: "1:619217370430:web:1234567890abcdef123456" // You'll need to generate a Web App in your Firebase console for a correct web appId
  // The provided JSON is for an Android app. I'm providing an assumed web structure.
  // You might want to get the correct web config from your Firebase Project Settings.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// You can export the app if needed
export default app;