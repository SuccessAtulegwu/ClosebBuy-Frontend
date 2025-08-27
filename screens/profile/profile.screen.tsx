import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/context/ThemeContext';

export function ProfileScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <View>
            <Text>profile</Text>
        </View>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({

    })
}