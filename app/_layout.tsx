import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ThemeProvider from '../context/ThemeContext'
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack screenOptions={{
          headerTintColor: '#8BC34A', 
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(routes)/auth/google" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(routes)/auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="(routes)/auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(routes)/auth/password" options={{ title: 'Change Password', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/notification/notification" options={{ title: 'Notifications', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/cart/cart" options={{ title: 'Shopping Cart', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/cart/shipping" options={{ title: 'Shipping Address', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/cart/payment" options={{ title: 'Payment Method', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/cart/review" options={{ title: 'Review Order', headerBackTitle: 'Back', }} />
          <Stack.Screen name="(routes)/cart/success" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
