// Firebase Authentication Service
// Handles all Firebase authentication operations

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/config/firebase.config';

export interface FirebaseAuthResponse {
  user: FirebaseUser;
  token: string;
}

export const FirebaseAuthService = {
  /**
   * Register a new user with email and password
   */
  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<FirebaseAuthResponse> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName,
        });
      }

      // Get ID token
      const token = await userCredential.user.getIdToken();
      

      return {
        user: userCredential.user,
        token,
      };
    } catch (error: any) {
      // Don't log error to console, just throw formatted message
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<FirebaseAuthResponse> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get ID token
      const token = await userCredential.user.getIdToken();

      return {
        user: userCredential.user,
        token,
      };
    } catch (error: any) {
      // Don't log error to console, just throw formatted message
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      // Don't log error to console, just throw formatted message
      throw new Error('Failed to sign out');
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      // Don't log error to console, just throw formatted message
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  },

  /**
   * Get current user's ID token
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return await currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      // Silently return null on token error
      return null;
    }
  },

  /**
   * Get current Firebase user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return auth.onAuthStateChanged(callback);
  },
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}

export default FirebaseAuthService;

