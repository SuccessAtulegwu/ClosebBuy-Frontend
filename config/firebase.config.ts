// Firebase Configuration
// Get these values from your Firebase Console: https://console.firebase.google.com

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  Auth
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Import getReactNativePersistence dynamically to avoid type errors
// This is a known issue with Firebase JS SDK in React Native
const getReactNativePersistence = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const auth = require('firebase/auth');
    return auth.getReactNativePersistence;
  } catch {
    return null;
  }
})();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

// Validate Firebase config
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Firebase Configuration Error:');
  console.error(`Missing required fields: ${missingFields.join(', ')}`);
  console.error('Please configure your Firebase credentials in the .env file');
  console.error('See .env for template');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
// For React Native, we'll rely on AsyncStorage through our own implementation
// The web SDK doesn't have getReactNativePersistence, so we use browser persistence
let auth: Auth;

if (Platform.OS === 'web') {
  // Use default auth for web
  auth = getAuth(app);
} else {
  // For native platforms, use initializeAuth with AsyncStorage persistence
  try {
    if (getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } else {
      // Fallback if persistence is not available
      auth = getAuth(app);
    }
  } catch (error) {
    // If already initialized, just get it
    auth = getAuth(app);
  }
}

export { app, auth };
export default app;

