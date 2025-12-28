import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { HomeHeader } from '@/components/HomeHeader';
import { Dimensions } from 'react-native';

export function AboutScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const inset = useSafeAreaInsets();
    const router = useRouter();
    const userInfo = {
        fullName: 'David Okaiye',
        phoneNumber: '08138999568',
        bikeModel: 'KIJA 363 APP',
        joinDate: '14 APRIL 2021'
    };

    const navigaeToChangePassword = () => {
        router.push('/(routes)/auth/password');
    }

    

    const toggleTheme = () => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    }

    const profileItems = [
        {
            icon: 'person-outline',
            label: 'Full Name',
            value: userInfo.fullName,
            hasArrow: false
        },
        {
            icon: 'call-outline',
            label: 'Phone',
            value: userInfo.phoneNumber,
            hasArrow: false
        },
        {
            icon: 'calendar-outline',
            label: 'Since',
            value: userInfo.joinDate,
            hasArrow: false
        }
    ];

    const settingsItems = [
       /*  {
            icon: 'moon-outline',
            label: 'Dark Mode',
            subtitle: 'Switch between light and dark theme',
            hasArrow: false,
            isThemeToggle: true,
            onPress: () => toggleTheme()
        }, */
        {
            icon: 'lock-closed-outline',
            label: 'Change Password',
            subtitle: 'Change your password',
            hasArrow: true,
            onPress: () => navigaeToChangePassword()
        },
    ];

    const renderProfileItem = (item: any, index: any) => (
        <View key={index} style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#9CA3AF" />
                </View>
                <View style={styles.profileItemContent}>
                    <Text style={styles.profileLabel}>{item.label}</Text>
                    <Text style={styles.profileValue}>{item.value}</Text>
                </View>
            </View>
        </View>
    );

    const renderSettingsItem = (item: any, index: any) => (
        <TouchableOpacity
            key={index}
            style={[
                styles.settingsItem,
                item.isLogout && styles.logoutItem
            ]}
            onPress={item.onPress}
            disabled={item.isThemeToggle}
            activeOpacity={item.isThemeToggle ? 1 : 0.7}
        >
            <View style={styles.settingsItemLeft}>
                <View style={[
                    styles.iconContainer,
                    item.isLogout && styles.logoutIconContainer,
                    item.isThemeToggle && styles.themeIconContainer
                ]}>
                    <Ionicons
                        name={item.isThemeToggle ? (colorScheme === 'dark' ? 'moon' : 'sunny-outline') : item.icon}
                        size={20}
                        color={item.isLogout ? "#EF4444" : item.isThemeToggle ? "#F59E0B" : "#9CA3AF"}
                    />
                </View>
                <View style={styles.settingsItemContent}>
                    <Text style={[
                        styles.settingsLabel,
                        item.isLogout && styles.logoutLabel
                    ]}>
                        {item.label}
                    </Text>
                    {item.subtitle && (
                        <Text style={styles.settingsSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
           {/*  {item.isThemeToggle ? (
                <Switch
                    value={colorScheme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#D1D5DB', true: theme.secondary }}
                    thumbColor={colorScheme === 'dark' ? '#FFFFFF' : '#F3F4F6'}
                    ios_backgroundColor="#D1D5DB"
                />
            ) : item.hasArrow ? (
                <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            ) : null} */}
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen options={{
                headerBackTitle:'Back', headerTitle:'About Me'
                       }} />

            <ThemedView style={{ flex: 1 }}>
                <ScrollView style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}>
                    {/* Profile Information Card */}
                    <View style={styles.profileCard}>
                        {profileItems.map((item, index) => renderProfileItem(item, index))}
                    </View>

                    {/* Settings Section */}
                    <View style={styles.settingsSection}>
                        {settingsItems.map((item, index) => renderSettingsItem(item, index))}
                    </View>
                </ScrollView>
            </ThemedView>
        </>

    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        content: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 20,
            position: 'relative'
        },
        profileCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        profileItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
        },
        profileItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F9FAFB',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        logoutIconContainer: {
            backgroundColor: '#FEE2E2',
        },
        themeIconContainer: {
            backgroundColor: '#FEF3C7',
        },
        profileItemContent: {
            flex: 1,
        },
        profileLabel: {
            fontSize: 12,
            color: '#9CA3AF',
            marginBottom: 2,
        },
        profileValue: {
            fontSize: 16,
            color: '#1F2937',
            fontWeight: '500',
        },
        settingsSection: {
            gap: 12,
        },
        settingsItem: {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        logoutItem: {
            backgroundColor: '#FFFFFF',
        },
        settingsItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        settingsItemContent: {
            flex: 1,
        },
        settingsLabel: {
            fontSize: 16,
            color: '#1F2937',
            fontWeight: '500',
        },
        logoutLabel: {
            color: '#EF4444',
        },
        settingsSubtitle: {
            fontSize: 12,
            color: '#9CA3AF',
            marginTop: 2,
        },
        loggingContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 100,
            zIndex: 9999,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
        }
    })
}