import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { HomeHeader } from '@/components/HomeHeader';
import { ThemedView } from '@/components/ThemedView';

export function SearchScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
         <>
            <Stack.Screen options={{
                headerShown: true, header: () => <HomeHeader title='Search' />
            }} />
            <ThemedView style={{ flex: 1 }}>
                <Text>Search</Text>
            </ThemedView>
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({

    })
}