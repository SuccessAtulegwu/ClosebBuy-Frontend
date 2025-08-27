import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemeContext } from '@/context/ThemeContext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { fontFamilies, fontSizes } from '@/constants/app.constants'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router'
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
    title: string;
}
const SCREEN_WIDTH = Dimensions.get('window').width;
export function HomeHeader({ title }: Props) {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const [notificationCount, setNotificationCount] = useState(900);
    const [unreadCount, setUnreadCount] = useState(90);
    const color = theme.primary;
    const inset = useSafeAreaInsets();
    const styles = getStyles(theme);
    const scrollRef = useRef<ScrollView | null>(null);
    const tabLayouts = useRef<Record<string, { x: number; width: number }>>({});

    const handleTabPress = (tabKey: string) => {
        const layout = tabLayouts.current[tabKey];
        scrollRef.current?.scrollTo({ x: Math.max(layout.x - SCREEN_WIDTH / 2 + layout.width / 2, 0), animated: true });
    }


    return (
        <>
            <ThemedView style={[{ paddingTop: inset.top }]}>
                <ThemedView style={[styles.container]}>
                    <ThemedText style={[styles.headerTitle, { color }]}>{title}</ThemedText>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <View style={styles.iconWrapper}>
                                <MaterialCommunityIcons name="cart-outline" size={24} color={theme.text} />
                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.iconWrapper}>
                                <Feather name="bell" size={24} color={theme.text} />
                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
                <View style={styles.filtersWrapperTop}>

                </View>
            </ThemedView>
            <ThemedView style={[styles.headerLine, { backgroundColor: theme.tabIconDefault }]}></ThemedView>
        </>
    )
}

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: scale(10),
            paddingVertical: verticalScale(5),
        },
        headerTitle: {
            fontSize: fontSizes.FONT24,
            paddingTop: moderateScale(10),
            fontWeight:'bold'
        },
        headerLine: {
            width: '100%',
            height: 0.35,
        },
        iconContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: moderateScale(5),
            paddingHorizontal: moderateScale(15),
            gap: 35,
        },
        iconWrapper: {
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: theme.accent,
            borderRadius: 12,
            minWidth: 25,
            height: 20,
            paddingHorizontal: 1,
            paddingVertical: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        badgeText: {
            color: '#fff',
            fontSize: 11,
            fontFamily: fontFamilies.NunitoSemiBold,
            textAlign: 'center',
        },
        filtersWrapperTop: {
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'

        },
        filterChipTop: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginRight: 15,
        },
        filterChip: {
            backgroundColor: '#f2f2f2',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 8,
        },
        chipActiveTop: {
            borderColor: theme.accent,
            borderBottomWidth: 2,
        },
        topChipText: {
            color: '#ccc',
            fontFamily: fontFamilies.NunitoSemiBold
        },
        topChipActiveText: {
            //color: '#d0ebff',
            color: theme.accent
        },

    })
}
