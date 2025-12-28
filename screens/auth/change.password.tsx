import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
const { height } = Dimensions.get('window');

interface Errors {
    currentPassword?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
}

export function ChangePasswordScreen() {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const inset = useSafeAreaInsets();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const validatePassword = (password: string) => {
        return {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
        };
    };

    const handleSubmit = async () => {
        setErrors({});
        let newErrors: Errors = {};
        let hasError = false;

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
            hasError = true;
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
            hasError = true;
        } else {
            const validation = validatePassword(newPassword);
            if (!validation.minLength || !validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumber) {
                newErrors.newPassword = 'Password must be at least 8 chars, with uppercase, lowercase and number';
                hasError = true;
            }
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            Alert.alert('Success', 'Password updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Change password error:', error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setErrors({ currentPassword: 'Incorrect current password' });
            } else if (error.code === 'auth/weak-password') {
                setErrors({ newPassword: 'Password is too weak' });
            } else {
                Alert.alert('Error', 'Failed to update password: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    
                >
                    <View style={styles.formContainer}>

                        {/* Current Password */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Current Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter current password"
                                    placeholderTextColor={theme.textSecondary}
                                    value={currentPassword}
                                    onChangeText={(text) => {
                                        setCurrentPassword(text);
                                        setErrors(prev => ({ ...prev, currentPassword: null }));
                                    }}
                                    secureTextEntry={!showCurrentPassword}
                                />
                                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
                        </View>

                        {/* New Password */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="key-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    placeholderTextColor={theme.textSecondary}
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        setErrors(prev => ({ ...prev, newPassword: null }));
                                    }}
                                    secureTextEntry={!showNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                        </View>

                        {/* Confirm New Password */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="checkmark-circle-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={theme.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setErrors(prev => ({ ...prev, confirmPassword: null }));
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.submitButtonText}>Update Password</Text>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    )
}

function getStyles(theme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
        scrollContainer: {
            flexGrow: 1,
            paddingBottom:100,
        },
        formContainer: {
            padding: 24,
        },
        inputWrapper: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            color: theme.text,
            marginBottom: 8,
            fontWeight: '500',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.4,
            borderColor: theme.tabIconDefault,
            borderRadius: 12,
            backgroundColor: theme.background_input,
            paddingHorizontal: 12,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            paddingVertical: 14,
            fontSize: 16,
            color: theme.text,
        },
        eyeIcon: {
            padding: 8,
        },
        errorText: {
            color: '#e74c3c', // Red color for errors
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
        },
        submitButton: {
            backgroundColor: theme.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 24,
            shadowColor: theme.secondary,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        disabledButton: {
            opacity: 0.7,
        },
        submitButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    })
}