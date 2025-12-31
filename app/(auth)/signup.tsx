import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { signUpUser, clearError } from '@/redux/slices/authSlice';
import { fontFamilies } from '@/constants/app.constants';
import { EstateService } from '@/apiServices/estateService';
import { Estate } from '@/types/publicTypes';

export default function SignUpScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    estateId: 0,
    estateName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    estate?: string;
  }>({});

  // Estate selection
  const [estates, setEstates] = useState<Estate[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<Estate[]>([]);
  const [showEstateModal, setShowEstateModal] = useState(false);
  const [estateSearchQuery, setEstateSearchQuery] = useState('');
  const [loadingEstates, setLoadingEstates] = useState(false);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, []);

  // Fetch estates on mount
  useEffect(() => {
    fetchEstates();
  }, []);

  const fetchEstates = async () => {
    setLoadingEstates(true);
    try {
      const response = await EstateService.getEstates();
      if (response.success && response.data) {
        setEstates(response.data);
        setFilteredEstates(response.data);
      } else {
        Alert.alert('Error', 'Failed to load estates. Please try again.');
      }
    } catch (error) {
      console.error('Fetch estates error:', error);
    } finally {
      setLoadingEstates(false);
    }
  };

  // Filter estates based on search query
  useEffect(() => {
    if (estateSearchQuery.trim() === '') {
      setFilteredEstates(estates);
    } else {
      const filtered = estates.filter((estate) =>
        estate.name.toLowerCase().includes(estateSearchQuery.toLowerCase())
      );
      setFilteredEstates(filtered);
    }
  }, [estateSearchQuery, estates]);

  const handleSelectEstate = (estate: Estate) => {
    setFormData({
      ...formData,
      estateId: estate.id,
      estateName: estate.name,
    });
    setErrors({ ...errors, estate: undefined });
    setShowEstateModal(false);
    setEstateSearchQuery('');
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Estate validation
    if (!formData.estateId || formData.estateId === 0) {
      newErrors.estate = 'Please select your estate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(
        signUpUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          estateId: formData.estateId,
        })
      ).unwrap();

      // Navigate to home on success
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error || 'An error occurred during sign up');
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.name ? '#ff4757' : theme.tabIconDefault}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  setErrors({ ...errors, name: undefined });
                }}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

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
                placeholder="Create a password"
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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.confirmPassword ? '#ff4757' : theme.tabIconDefault}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, confirmPassword: text });
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={theme.tabIconDefault}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Estate Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estate</Text>
            <TouchableOpacity
              style={[styles.inputWrapper, errors.estate && styles.inputError]}
              onPress={() => setShowEstateModal(true)}
              disabled={loadingEstates}
            >
              <Ionicons
                name="business-outline"
                size={20}
                color={errors.estate ? '#ff4757' : theme.tabIconDefault}
                style={styles.inputIcon}
              />
              <Text
                style={[
                  styles.estateText,
                  !formData.estateName && styles.placeholderText,
                ]}
              >
                {loadingEstates
                  ? 'Loading estates...'
                  : formData.estateName || 'Select your estate'}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={theme.tabIconDefault}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            {errors.estate && <Text style={styles.errorText}>{errors.estate}</Text>}
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#ff4757" />
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Estate Selection Modal */}
      <Modal
        visible={showEstateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEstateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Estate</Text>
              <TouchableOpacity onPress={() => setShowEstateModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.tabIconDefault}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search estates..."
                placeholderTextColor={theme.tabIconDefault}
                value={estateSearchQuery}
                onChangeText={setEstateSearchQuery}
                autoCapitalize="none"
              />
              {estateSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setEstateSearchQuery('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.tabIconDefault}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Estates List */}
            {loadingEstates ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={styles.loadingText}>Loading estates...</Text>
              </View>
            ) : filteredEstates.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="business-outline"
                  size={48}
                  color={theme.tabIconDefault}
                />
                <Text style={styles.emptyText}>
                  {estateSearchQuery
                    ? 'No estates found matching your search'
                    : 'No estates available'}
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchEstates}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredEstates}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.estateItem,
                      formData.estateId === item.id && styles.estateItemSelected,
                    ]}
                    onPress={() => handleSelectEstate(item)}
                  >
                    <View style={styles.estateItemContent}>
                      <Ionicons
                        name="business"
                        size={24}
                        color={
                          formData.estateId === item.id
                            ? theme.primary
                            : theme.tabIconDefault
                        }
                      />
                      <View style={styles.estateInfo}>
                        <Text style={styles.estateName}>{item.name}</Text>
                        {item.address && (
                          <Text style={styles.estateAddress}>{item.address}</Text>
                        )}
                      </View>
                    </View>
                    {formData.estateId === item.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.estatesList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
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
      marginBottom: 32,
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
    signUpButton: {
      backgroundColor: theme.accent,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    signUpButtonDisabled: {
      opacity: 0.6,
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    loginLink: {
      fontSize: 14,
      color: theme.accent,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    // Estate selection styles
    estateText: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
      fontFamily: fontFamilies.NunitoRegular,
    },
    placeholderText: {
      color: theme.tabIconDefault,
    },
    chevronIcon: {
      marginLeft: 8,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.tabIconDefault + '20',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.tabIconDefault + '30',
      paddingHorizontal: 16,
      margin: 20,
      marginBottom: 10,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.text,
      fontFamily: fontFamilies.NunitoRegular,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      marginTop: 12,
      fontFamily: fontFamilies.NunitoRegular,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      textAlign: 'center',
      marginTop: 12,
      marginBottom: 16,
      fontFamily: fontFamilies.NunitoRegular,
    },
    retryButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    estatesList: {
      paddingHorizontal: 20,
    },
    estateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.tabIconDefault + '20',
    },
    estateItemSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    estateItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    estateInfo: {
      marginLeft: 12,
      flex: 1,
    },
    estateName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    estateAddress: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
  });
}

