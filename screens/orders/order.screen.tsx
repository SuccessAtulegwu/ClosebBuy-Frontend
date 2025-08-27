import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { HomeHeader } from '@/components/HomeHeader';

export function OrderScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <HomeHeader title='Orders' />
            }} />
            <ThemedView style={{ flex: 1 }}>
                <Text>HomeScreen</Text>
            </ThemedView>
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({

    })
}