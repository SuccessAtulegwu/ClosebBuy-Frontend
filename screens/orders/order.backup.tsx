import { StyleSheet, Text, TouchableOpacity, View, Image, Animated, Dimensions } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { HomeHeader } from '@/components/HomeHeader';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies, IsIOS } from '@/constants/app.constants';
import NewOrders from '@/components/NewOrders';
import OrderHistory from '@/components/OrderHistory';

const { width } = Dimensions.get('window');

export function OrderBackupScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);


    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <HomeHeader title='Orders' />
            }} />
            <ThemedView style={styles.container}>
                <NewOrders />
            </ThemedView>
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

    })
}