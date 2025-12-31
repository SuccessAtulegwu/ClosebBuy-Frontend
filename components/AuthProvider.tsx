// Auth Initialization Component
// Restores user session on app load

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreSession } from '@/redux/slices/authSlice';
import { useRouter, usePathname } from 'expo-router';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  // Restore session on mount
  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (!isInitialized) return;

    // Check if current path is an auth route
    const isAuthRoute = pathname?.includes('/login') || pathname?.includes('/signup');

    if (!isAuthenticated && !isAuthRoute) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && isAuthRoute) {
      // Redirect to home if already authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, pathname]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AuthProvider;

