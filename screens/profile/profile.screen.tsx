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
import { useAppDispatch } from '@/redux/hooks';
import { signOutUser } from '@/redux/slices/authSlice';

export function ProfileScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const inset = useSafeAreaInsets();
    const router = useRouter();
    const [logging, setLogging] = useState(false);
     const dispatch = useAppDispatch();

    // Updated user info to match design structure (Name + Email)
    // In a real app, this would likely come from a context or prop
    const userInfo = {
        fullName: 'Olivia Austin', // Changed to match design for visual verification
        email: 'oliviaaustin@gmail.com',
        avatar: require('@/assets/images/user.png')
    };

    const handleLogout = async () => {
        setLogging(true);
        setTimeout(() => {
            setLogging(false);
            //router.push('/(auth)/login');
            dispatch(signOutUser());
        }, 2000);
    }

    const navigateToAbout = async () => {
       router.push('/(routes)/accounts/about');
    }


     const navigateTocard = async () => {
       router.push('/(routes)/accounts/card');
    }

     const navigateToOrders = async () => {
       router.push('/(tabs)/orders');
    }

     const navigateToFav = async () => {
       router.push('/(tabs)/search');
    }

     const navigateToAddress = async () => {
       router.push('/(routes)/accounts/address');
    }

     const navigateToNotify = async () => {
       router.push('/(routes)/accounts/settings');
    }
    

    const menuItems = [
        {
            icon: 'person-outline',
            label: 'About me',
            onPress: () => navigateToAbout()
        },
        {
            icon: 'cube-outline', // My Orders
            label: 'My Orders',
            onPress: () => navigateToOrders()
        },
        {
            icon: 'heart-outline',
            label: 'My Favorites',
            onPress: () => navigateToFav()
        },
        {
            icon: 'location-outline',
            label: 'My Address',
            onPress: () => navigateToAddress()
        },
        {
            icon: 'card-outline',
            label: 'Credit Cards',
            onPress: () => navigateTocard()
        },
       /*  {
            icon: 'swap-horizontal-outline', // Transactions
            label: 'Transactions',
            onPress: () => { }
        }, */
        {
            icon: 'notifications-outline',
            label: 'Notifications',
            onPress: () => navigateToNotify()
        },
        {
            icon: 'log-out-outline',
            label: 'Sign out',
            isLogout: false, // Design shows it same style as others
            onPress: () => handleLogout()
        }
    ];

    const renderMenuItem = (item: any, index: any) => (
        <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer]}>
                    <Ionicons
                        name={item.icon}
                        size={22}
                        color="#10B981"
                    />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <>

            <ThemedView style={{ flex: 1,paddingTop:inset.top, }}>
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={userInfo.avatar}
                                style={styles.avatar}
                                resizeMode='cover'
                            />
                            <View style={styles.cameraBadge}>
                                <Ionicons name="camera" size={12} color="#FFFFFF" />
                            </View>
                        </View>
                        <Text style={styles.userName}>{userInfo.fullName}</Text>
                        <Text style={styles.userEmail}>{userInfo.email}</Text>
                    </View>

                    {/* Menu List */}
                    <View style={styles.menuList}>
                        {menuItems.map((item, index) => renderMenuItem(item, index))}
                    </View>
                </ScrollView>
            </ThemedView>

            {logging &&
                (<ThemedView style={styles.loggingContainer}>
                    <ActivityIndicator size={20} color={theme.secondary} />
                </ThemedView>)
            }
        </>
    )
}


function getStyles(theme: any) {
    return StyleSheet.create({
        content: {
            flex: 1,
            backgroundColor: theme.background,
        },
        headerSection: {
            alignItems: 'center',
            paddingVertical: 20,
            backgroundColor: theme.background, // Match design background
        },
        avatarContainer: {
            position: 'relative',
            marginBottom: 12,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            elevation:12,
            borderWidth:1,
            borderColor: theme.secondary
        },
        cameraBadge: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#10B981', // Green badge
            width: 28,
            height: 28,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#F9FAFB',
        },
        userName: {
            fontSize: 20,
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: 4,
        },
        userEmail: {
            fontSize: 14,
            color: '#9CA3AF',
        },
        menuList: {
            paddingHorizontal: 20,
            marginTop: 5,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
            // No border bottom in the design effectively? Or maybe very subtle. 
            // The image looks clean. Let's add no border or very subtle.
            backgroundColor: 'transparent',
        },
        menuItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            // Design has no background for icons, just the green icon itself?
            // Wait, looking closely at the image "About me", "My Orders"... the icons are green outline. 
            // They do NOT seem to have a background circle in the provided design image. 
            // The previous code had a background. I will remove the background to match exact design.
            backgroundColor: 'transparent',
        },
        menuLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: '#1F2937',
        },
        loggingContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent for better visibility
            alignItems: 'center',
            justifyContent: 'center',
        }
    })
}