import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { HomeHeader } from '@/components/HomeHeader';
import { ThemedView } from '@/components/ThemedView';
import { SavedItems } from '@/components/SavedItems';

export function SearchScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <>
            <Stack.Screen options={{
                headerShown: true, header: () => <HomeHeader title='Favorites' showCartIcon={true} showNotificationIcon={true} />
            }} />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <SavedItems />
            </ScrollView>
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
       scrollContainer: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
            paddingTop:20
        },
    })
}