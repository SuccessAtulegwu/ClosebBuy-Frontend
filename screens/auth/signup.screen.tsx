import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
interface Errors {
    email?: string | null;
    fullName?: string | null;
    password?: string | null;
}
type FieldType = 'email' | 'fullName' | 'password';
interface Touched {
    email?: boolean;
    fullName?: boolean;
    password?: boolean;
}
const { width, height } = Dimensions.get('window');

export function SignupScreen() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    const router = useRouter();

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /* const validateFullName = (name: string) => {
        return name.trim().length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ]+([-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*\s[A-Za-zÀ-ÖØ-öø-ÿ]+([-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name.trim());
    }; */

    const navigateBack = () => {
        router.replace('/(routes)/auth/google');
    }

    const navigateToLogin = () => {
        router.push('/(routes)/auth/login');
    }

    const validateFullName = (name: string): boolean => {
        const trimmedName = name.trim();

        // Check minimum length
        if (trimmedName.length < 2) {
            return false;
        }

        // Check maximum length (reasonable limit)
        if (trimmedName.length > 50) {
            return false;
        }

        // Enhanced regex for international names with better flexibility
        // Supports: letters, spaces, hyphens, apostrophes, dots (for titles like Jr.)
        // Handles multiple languages including accented characters
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-я\u4e00-\u9fff\u0600-\u06ff]+([-'.\s][A-Za-zÀ-ÖØ-öø-ÿĀ-žА-я\u4e00-\u9fff\u0600-\u06ff]+)*$/;

        if (!nameRegex.test(trimmedName)) {
            return false;
        }

        // Must contain at least one space (ensures first + last name)
        if (!trimmedName.includes(' ')) {
            return false;
        }

        // Check that it doesn't start or end with special characters
        const startsEndsWithLetter = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-я\u4e00-\u9fff\u0600-\u06ff].*[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-я\u4e00-\u9fff\u0600-\u06ff]$/.test(trimmedName);
        if (!startsEndsWithLetter) {
            return false;
        }

        // Ensure no consecutive special characters
        if (/[-'.\s]{2,}/.test(trimmedName)) {
            return false;
        }

        // Split into parts and validate each part
        const nameParts = trimmedName.split(/\s+/);

        // Must have at least 2 parts (first and last name)
        if (nameParts.length < 2) {
            return false;
        }

        // Each part must be at least 1 character and not just special characters
        return nameParts.every(part =>
            part.length >= 1 &&
            /[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-я\u4e00-\u9fff\u0600-\u06ff]/.test(part)
        );
    };

    const validatePassword = (password: any) => {
        return {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };

    const getPasswordStrength = (password: any) => {
        const validation = validatePassword(password);
        const score = Object.values(validation).filter(Boolean).length;
        return score;
    };

    const handleInputChange = (field: FieldType, value: string) => {
        // Update the field value
        switch (field) {
            case 'email':
                setEmail(value);
                break;
            case 'fullName':
                setFullName(value);
                break;
            case 'password':
                setPassword(value);
                break;
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleBlur = (field: any) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field: any) => {
        let error = null;

        switch (field) {
            case 'email':
                if (!email) {
                    error = 'Email is required';
                } else if (!validateEmail(email)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'fullName':
                if (!fullName) {
                    error = 'Full name is required';
                } else if (!validateFullName(fullName)) {
                    error = 'Please enter a valid full name (letters only, min 2 characters)';
                }
                break;
            case 'password':
                if (!password) {
                    error = 'Password is required';
                } else {
                    const validation = validatePassword(password);
                    if (!validation.minLength) {
                        error = 'Password must be at least 8 characters long';
                    } else if (!validation.hasUpperCase || !validation.hasLowerCase) {
                        error = 'Password must contain both uppercase and lowercase letters';
                    } else if (!validation.hasNumber) {
                        error = 'Password must contain at least one number';
                    }
                }
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const handleSignUp = () => {
        // Validate all fields
        const emailValid = validateField('email');
        const fullNameValid = validateField('fullName');
        const passwordValid = validateField('password');

        // Mark all fields as touched
        setTouched({ email: true, fullName: true, password: true });

        if (emailValid && fullNameValid && passwordValid) {
            // All validations passed
            console.log('Sign up with:', { email, fullName, password });
            // Handle sign up logic here
            router.push('/(routes)/auth/login');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Welcome</Text>
                        <View style={styles.headerRight} />
                    </View>

                    {/* Hero Image */}
                    <View style={styles.heroContainer}>
                        <Image
                            source={require('@/assets/images/maskGroup2.png')}
                            style={styles.heroImage}
                        />
                        <View style={styles.heroOverlay} />
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        <View style={styles.formContent}>
                            <Text style={styles.title}>Create account</Text>
                            <Text style={styles.subtitle}>Quickly create account</Text>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.email && touched.email && styles.inputError]}
                                    placeholder="Email address"
                                    placeholderTextColor="#999"
                                    value={email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                    onBlur={() => handleBlur('email')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                />
                            </View>
                            {errors.email && touched.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}

                            {/* Full Name Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.fullName && touched.fullName && styles.inputError]}
                                    placeholder="Full name"
                                    placeholderTextColor="#999"
                                    value={fullName}
                                    onChangeText={(text) => handleInputChange('fullName', text)}
                                    onBlur={() => handleBlur('fullName')}
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                />
                            </View>
                            {errors.fullName && touched.fullName && (
                                <Text style={styles.errorText}>{errors.fullName}</Text>
                            )}

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, errors.password && touched.password && styles.inputError]}
                                    placeholder="Password"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={(text) => handleInputChange('password', text)}
                                    onBlur={() => handleBlur('password')}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color="#999"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && touched.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}

                            {/* Password Strength Indicator */}
                            <View style={styles.passwordStrength}>
                                {[...Array(8)].map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.strengthDot,
                                            index < getPasswordStrength(password) && styles.activeDot,
                                            getPasswordStrength(password) >= 6 && index < getPasswordStrength(password) && styles.strongDot,
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Sign Up Button */}
                            <TouchableOpacity
                                style={[
                                    styles.signupButton,
                                    (!email || !fullName || !password || Object.values(errors).some(error => error)) && styles.disabledButton
                                ]}
                                onPress={handleSignUp}
                                disabled={!email || !fullName || !password || Object.values(errors).some(error => error)}
                            >
                                <Text style={styles.signupButtonText}>Signup</Text>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Already have an account? </Text>
                                <TouchableOpacity onPress={navigateToLogin}>
                                    <Text style={styles.loginLink}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    headerRight: {
        width: 40,
    },
    heroContainer: {
        height: height * 0.4,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    formContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        paddingTop: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        minHeight: height * 0.65,
    },
    formContent: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 8,
        paddingBottom: 12,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
        paddingVertical: 8,
    },
    inputError: {
        color: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginBottom: 16,
        marginLeft: 32,
    },
    eyeIcon: {
        padding: 4,
    },
    passwordStrength: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 4,
    },
    strengthDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        marginRight: 6,
    },
    activeDot: {
        backgroundColor: '#f39c12',
    },
    strongDot: {
        backgroundColor: '#27ae60',
    },
    signupButton: {
        backgroundColor: '#8BC34A',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#8BC34A',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: '#bdc3c7',
        shadowOpacity: 0,
        elevation: 0,
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '600',
    },
});