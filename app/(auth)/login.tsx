import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { signInUser, clearError } from '@/redux/slices/authSlice';
import { fontFamilies } from '@/constants/app.constants';
import { alertService } from '@/utils/alertService';

export default function LoginScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Clear errors when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const result = await dispatch(
        signInUser({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        })
      ).unwrap();

      // Navigate to home on success
      router.replace('/(tabs)');
    } catch (error: any) {
      alertService.error('Login Failed', error);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password' as any);
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
    dispatch(clearError());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={errors.email ? '#ff4757' : theme.tabIconDefault}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? '#ff4757' : theme.tabIconDefault}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={theme.tabIconDefault}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#ff4757" />
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      fontFamily: fontFamilies.NunitoBold,
    },
    subtitle: {
      fontSize: 16,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.tabIconDefault + '30',
      paddingHorizontal: 16,
    },
    inputError: {
      borderColor: '#ff4757',
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
      fontFamily: fontFamilies.NunitoRegular,
    },
    eyeIcon: {
      padding: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#ff4757',
      marginTop: 4,
      fontFamily: fontFamilies.NunitoRegular,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: theme.accent,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ff475720',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      gap: 8,
    },
    errorBoxText: {
      flex: 1,
      fontSize: 14,
      color: '#ff4757',
      fontFamily: fontFamilies.NunitoRegular,
    },
    loginButton: {
      backgroundColor: theme.accent,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signUpText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    signUpLink: {
      fontSize: 14,
      color: theme.accent,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
  });
}

