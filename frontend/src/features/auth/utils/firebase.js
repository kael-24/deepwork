import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  // routes frontend request to correct firebase project 
  apiKey: "AIzaSyC8Fm1MXtlSKW53Djb6nioTnYCW7d2voUc",

  // The domain where Firebase Auth redirects occur
  authDomain: "login-11f89.firebaseapp.com",

  // The unique ID of your Firebase project 
  projectId: "login-11f89",

  // The default Google Cloud Storage bucket for file uploads.
  // Used for: Uploading images, PDFs, files
  storageBucket: "login-11f89.firebasestorage.app",

  // A unique numeric ID used by Firebase Cloud Messaging (FCM).
  // Sending push notifications (usually in mobile apps or PWA setup).
  messagingSenderId: "17170736400",

  // Unique identifier for your Firebase app installation.
  // Firebase Analytics and internal linking between Firebase services.
  appId: "1:17170736400:web:788b8cbeeb32432c5e3195"
};

// Initialize Firebase app using project's config -- registers the frontend app to firebase using config credentials
// returns a Firebase app instance (app) that serves as the container for all Firebase services (Auth, Firestore, Storage, etc.).
const app = initializeApp(firebaseConfig);

// creates a Firebase Authentication instance for the app (specifically to use firebase auth services)
const auth = getAuth(app);

// creates Google sign-in instance provider (to specify that you are using google for auth)
const googleProvider = new GoogleAuthProvider();

// signinWithPopup triggers Google login via a pop up window
// auth is the firebase project with auth specified connected with googleProvider that specifies Google as auth provider (Oauth)
export const googlePopupLogin = () => signInWithPopup(auth, googleProvider);

// logs out the current user from firebase side only (frontend only)
// Firebase removes current user session from the browser
export const firebaseLogout = () => signOut(auth);

// exports auth for other authentication services.
export { auth };