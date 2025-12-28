import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setShippingAddress } from '@/redux/slices/orderSlice';
import { fontFamilies } from '@/constants/app.constants';
import LocalStorageService, { SavedAddress } from '@/utils/localStorage';

export default function ShippingScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { shippingAddress } = useAppSelector((state) => state.order);
  
  const [formData, setFormData] = useState({
    fullName: shippingAddress?.fullName || '',
    phoneNumber: shippingAddress?.phoneNumber || '',
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || 'Orozo',
    state: shippingAddress?.state || 'Abuja',
    zipCode: shippingAddress?.zipCode || '900109',
    country: shippingAddress?.country || 'Nigeria',
    isDefault: false,
  });
  
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved addresses from local storage on mount
  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      setIsLoading(true);
      const addresses = await LocalStorageService.getSavedAddresses();
      setSavedAddresses(addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return false;
    }
    if (!formData.state.trim()) {
      Alert.alert('Error', 'Please enter your state');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // Set shipping address in Redux for current session
      dispatch(setShippingAddress(formData));
      
      // Save to local device storage if user checked the option
      if (formData.isDefault) {
        await LocalStorageService.saveAddress({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          isDefault: true,
        });
        
        Alert.alert(
          'Success',
          'Address saved to your device successfully!',
          [{ text: 'OK' }]
        );
      }
      
      router.push('/(routes)/cart/payment');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: false, // Don't auto-check save option
    });
    setShowSavedAddresses(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this saved address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocalStorageService.deleteAddress(addressId);
              await loadSavedAddresses(); // Reload list
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
         {/* Saved Addresses */}
         {isLoading ? (
           <View style={styles.loadingContainer}>
             <ActivityIndicator size="small" color={theme.accent} />
             <Text style={styles.loadingText}>Loading saved addresses...</Text>
           </View>
         ) : savedAddresses.length > 0 ? (
           <View style={styles.section}>
             <TouchableOpacity
               style={styles.savedAddressesHeader}
               onPress={() => setShowSavedAddresses(!showSavedAddresses)}
             >
               <Text style={styles.sectionTitle}>
                 Saved Addresses ({savedAddresses.length})
               </Text>
               <Ionicons
                 name={showSavedAddresses ? 'chevron-up' : 'chevron-down'}
                 size={24}
                 color={theme.text}
               />
             </TouchableOpacity>

             {showSavedAddresses && (
               <View style={styles.savedAddressesList}>
                 {savedAddresses.map((address) => (
                   <TouchableOpacity
                     key={address.id}
                     style={styles.savedAddressItem}
                     onPress={() => handleSelectSavedAddress(address)}
                   >
                     <View style={styles.addressIcon}>
                       <Ionicons name="location" size={20} color={theme.accent} />
                     </View>
                     <View style={styles.addressInfo}>
                       <Text style={styles.addressName}>{address.fullName}</Text>
                       <Text style={styles.addressText} numberOfLines={2}>
                         {address.address}, {address.city}, {address.state}
                       </Text>
                       <Text style={styles.addressPhone}>{address.phoneNumber}</Text>
                     </View>
                     <TouchableOpacity
                       onPress={(e) => {
                         e.stopPropagation();
                         handleDeleteAddress(address.id);
                       }}
                       style={styles.deleteButton}
                     >
                       <Ionicons name="trash-outline" size={20} color="#ff4757" />
                     </TouchableOpacity>
                   </TouchableOpacity>
                 ))}
               </View>
             )}
           </View>
         ) : null}

        {/* Delivery Information Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={theme.tabIconDefault}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="080XXXXXXXX"
              placeholderTextColor={theme.tabIconDefault}
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your street address"
              placeholderTextColor={theme.tabIconDefault}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.city}
                onChangeText={(text) => handleInputChange('city', text)}
                editable={false}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.state}
                onChangeText={(text) => handleInputChange('state', text)}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="100001"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.zipCode}
                onChangeText={(text) => handleInputChange('zipCode', text)}
                keyboardType="numeric"
                editable={false}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                placeholder="Nigeria"
                placeholderTextColor={theme.tabIconDefault}
                value={formData.country}
                onChangeText={(text) => handleInputChange('country', text)}
                editable={false}
              />
            </View>
          </View>

           <View style={styles.switchContainer}>
             <View style={styles.switchLabelContainer}>
               <Text style={styles.switchLabel}>Save this address on my device</Text>
               <Text style={styles.switchSubLabel}>
                 Saved locally for quick checkout next time
               </Text>
             </View>
             <Switch
               value={formData.isDefault}
               onValueChange={(value) => handleInputChange('isDefault', value)}
               trackColor={{ false: '#ccc', true: theme.accent + '50' }}
               thumbColor={formData.isDefault ? theme.accent : '#f4f3f4'}
             />
           </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color={theme.accent} />
          <Text style={styles.infoText}>
            Please ensure your address is correct. Incorrect addresses may result in delivery delays.
            N/B We don't deliver outside the estate
          </Text>
        </View>
      </ScrollView>

       {/* Bottom Button */}
       <View style={styles.bottomContainer}>
         <TouchableOpacity 
           style={[styles.continueButton, isSaving && styles.continueButtonDisabled]} 
           onPress={handleContinue}
           disabled={isSaving}
         >
           {isSaving ? (
             <ActivityIndicator color="#fff" />
           ) : (
             <>
               <Text style={styles.continueText}>Continue to Payment</Text>
               <Ionicons name="arrow-forward" size={20} color="#fff" />
             </>
           )}
         </TouchableOpacity>
       </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: 20,
      paddingBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      fontFamily: fontFamilies.NunitoBold,
    },
    savedAddressesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    savedAddressesList: {
      gap: 12,
    },
    savedAddressItem: {
      flexDirection: 'row',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    addressIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accent + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    addressInfo: {
      flex: 1,
    },
    addressName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    addressText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoRegular,
    },
    addressPhone: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    input: {
      backgroundColor: theme.cardcolor,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.tabIconDefault + '30',
      fontFamily: fontFamilies.NunitoRegular,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      padding: 16,
      borderRadius: 10,
      marginTop: 8,
    },
    switchLabelContainer: {
      flex: 1,
      marginRight: 12,
    },
    switchLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
      marginBottom: 4,
    },
    switchSubLabel: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    deleteButton: {
      padding: 8,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.accent + '15',
      borderRadius: 12,
      padding: 16,
      margin: 20,
      marginTop: 10,
      gap: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      fontFamily: fontFamilies.NunitoRegular,
    },
    bottomContainer: {
      backgroundColor: theme.cardcolor,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.tabIconDefault + '20',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 10,
    },
    continueButton: {
      flexDirection: 'row',
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    continueButtonDisabled: {
      opacity: 0.6,
    },
    continueText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
  });
}

