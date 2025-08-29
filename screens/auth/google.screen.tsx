import React, { useContext } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export function GoogleScreen() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();
    const styles = getStyles(theme);
    const handleContinueWithGoogle = () => {
        console.log('Continue with Google pressed');
    };

    const handleCreateAccount = () => {
        router.push('/(routes)/auth/signup')
    };

    const handleLogin = () => {
       router.push('/(routes)/auth/login')
    };

    const handleBackPress = () => {
        console.log('Back pressed');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"  />
            <ImageBackground
                source={require('@/assets/images/maskGroup.png')}
                style={styles.imageContainer}
                resizeMode="cover"
            >
                {/* <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Welcome</Text>
                    <View style={styles.placeholder} />
                </View> */}
                <View style={styles.imageOverlay} />

                <View style={styles.bottomContent}>
                    <Text style={styles.welcomeTitle}>Welcome</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Your all-in-one estate marketplace.{'\n'} Order groceries, meals, and essentials from trusted vendors around you — delivered right to your doorstep.
                    </Text>

                    {/* Google Continue Button */}
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleContinueWithGoogle}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{
                                uri: 'https://developers.google.com/identity/images/g-logo.png'
                            }}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.googleButtonText}>Continue with google</Text>
                    </TouchableOpacity>

                    {/* Create Account Button */}
                    <TouchableOpacity
                        style={styles.createAccountButton}
                        onPress={handleCreateAccount}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="person-outline" size={20} color="white" />
                        <Text style={styles.createAccountButtonText}>Create an account</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

        </View>
    );
};

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            position: 'absolute',
            top: 30,
            left: 0,
            right: 0,
            zIndex: 10,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: 'white',
        },
        placeholder: {
            width: 40,
        },
        imageContainer: {
            flex: 1,
            position: 'relative',
        },
        heroImage: {
            width: '100%',
            height: '100%',
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        bottomContent: {
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingTop: 30,
            paddingBottom: 40,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            zIndex:100
        },
        welcomeTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 12,
        },
        welcomeSubtitle: {
            fontSize: 16,
            color: '#666',
            lineHeight: 24,
            marginBottom: 30,
        },
        googleButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        googleIcon: {
            width: 20,
            height: 20,
            marginRight: 12,
        },
        googleButtonText: {
            fontSize: 16,
            color: '#333',
            fontWeight: '500',
            flex: 1,
            textAlign: 'center',
            marginRight: 32, // Offset for icon space
        },
        createAccountButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#8BC34A',
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        createAccountButtonText: {
            fontSize: 16,
            color: 'white',
            fontWeight: '500',
            flex: 1,
            textAlign: 'center',
            marginRight: 20, // Offset for icon space
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginText: {
            fontSize: 14,
            color: '#999',
        },
        loginLink: {
            fontSize: 14,
            color: '#000',
            fontWeight: '600',
        },
    });

}