
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

export function NotificationSettingsScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const inset = useSafeAreaInsets();
  const router = useRouter();

  const [settings, setSettings] = useState({
    allowNotifications: true,
    emailNotifications: false,
    orderNotifications: false,
    generalNotifications: true,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

 const notificationOptions = [
  {
    id: 'allowNotifications',
    label: 'Allow Notifications',
    description: 'Enable or disable all notifications from the app.'
  },
  {
    id: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Receive important updates and alerts via email.'
  },
  {
    id: 'orderNotifications',
    label: 'Order Notifications',
    description: 'Get notified about order status, delivery, and updates.'
  },
  {
    id: 'generalNotifications',
    label: 'General Notifications',
    description: 'Receive general announcements, tips, and app updates.'
  }
];

  return (
    <>
      <Stack.Screen options={{
        headerBackTitle:'Back',
        headerTitle: 'Notifications',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.text,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
      }} />

      <ThemedView style={[styles.container, { paddingTop: 10 }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notificationOptions.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#84CC16' }} // Green from design
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#D1D5DB"
                onValueChange={() => toggleSwitch(option.id as keyof typeof settings)}
                value={settings[option.id as keyof typeof settings]}
              />
            </View>
          ))}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: inset.bottom + 20 }]}>
          <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
            <Text style={styles.saveButtonText}>Save settings</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  )
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    scrollContent: {
      padding: 20,
      gap: 16,
      paddingBottom: 100, // Space for footer
    },
    optionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    optionTextContainer: {
      flex: 1,
      paddingRight: 16,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 8,
    },
    optionDescription: {
      fontSize: 12,
      color: '#9CA3AF',
      lineHeight: 18,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#F9FAFB', // Or white? Design looks like it floats on the background.
      // Actually the button is just at the bottom.
      // Let's add padding around it.
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    saveButton: {
      backgroundColor: '#84CC16', // Lime green
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#84CC16',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    }
  })
}