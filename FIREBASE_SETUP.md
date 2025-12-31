# Firebase Setup Guide

## 🔥 Firebase Configuration Error Fix

You're seeing the error `auth/configuration-not-found` because your Firebase credentials are not configured.

## ✅ Solution Steps

### 1. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ > **Project settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** and select **Web** (</>) icon
6. Copy the configuration values

### 2. Configure Your Environment Variables

Open the `.env` file in the `closebuy` directory and replace the placeholder values with your actual Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Enable Authentication Methods

In Firebase Console:
1. Go to **Authentication** > **Sign-in method**
2. Enable the authentication methods you plan to use (Email/Password, Google, etc.)

### 4. Configure Firestore/Database (if needed)

If you're using Firestore:
1. Go to **Firestore Database** > **Create database**
2. Start in **test mode** (for development)
3. Later update security rules for production

### 5. Restart Your Expo Server

After updating the `.env` file:

```bash
# Stop your current Expo server (Ctrl+C)
# Clear cache and restart
npx expo start --clear
```

## 🐛 Additional Issues Fixed

### ✅ AsyncStorage Persistence
Your code already implements AsyncStorage for Firebase Auth persistence on React Native, which is good!

### ✅ SafeAreaView Deprecation
Consider replacing `SafeAreaView` with `react-native-safe-area-context`:

```tsx
// Old
import { SafeAreaView } from 'react-native';

// New
import { SafeAreaView } from 'react-native-safe-area-context';
```

You already have `react-native-safe-area-context` installed.

### ✅ Network Request Failed
This is likely happening because:
1. Your API endpoint is not running
2. The `EXPO_PUBLIC_API_URL` is not configured

Make sure your backend server (hmb) is running:

```bash
cd d:\HoodMart\hmb
npm run start:dev  # or your start command
```

## 📱 Testing

After configuration:

1. **On iOS Simulator**: Should work directly
2. **On Android Emulator**: Should work directly
3. **On Physical Device**: Make sure your device and computer are on the same network

## 🔒 Security Notes

- ✅ `.env` is already in `.gitignore` - your credentials won't be committed
- 🚨 Never commit your `.env` file to version control
- 🚨 Use Firebase Security Rules to protect your database in production

## 🆘 Still Having Issues?

Check:
1. ✅ `.env` file exists in `closebuy` directory
2. ✅ All Firebase credentials are filled in correctly
3. ✅ Firebase Authentication is enabled in console
4. ✅ Expo dev server was restarted after adding `.env`
5. ✅ Backend API server is running (for the network errors)

---

Happy coding! 🚀

