import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export function LandingScreen() {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();
  useEffect(() => {
    const checkFirstTime = async () => {
      //router.replace('/(routes)/auth/google');
      router.replace('/(tabs)');
    };

    checkFirstTime();
  }, [])

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>CloseBuy Loading...</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({})