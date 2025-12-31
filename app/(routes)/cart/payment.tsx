import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPaymentMethod } from '@/redux/slices/orderSlice';
import { fontFamilies } from '@/constants/app.constants';
import LocalStorageService, { SavedPaymentMethod } from '@/utils/localStorage';
import { PaymentMethod as PaymentMethodEnum } from '@/types/publicenums';

export default function PaymentScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { paymentMethod } = useAppSelector((state) => state.order);
  
  const [selectedType, setSelectedType] = useState<PaymentMethodEnum>(
    paymentMethod?.type || PaymentMethodEnum.CARD
  );
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: paymentMethod?.cardNumber || '',
    cardHolderName: paymentMethod?.cardHolderName || '',
    expiryDate: paymentMethod?.expiryDate || '',
    cvv: paymentMethod?.cvv || '',
  });
  
  const [saveCard, setSaveCard] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved payment methods from local storage on mount
  useEffect(() => {
    loadSavedPaymentMethods();
  }, []);

  const loadSavedPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await LocalStorageService.getSavedPaymentMethods();
      setSavedPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentOptions = [
    {
      type: PaymentMethodEnum.CARD,
      icon: 'card-outline',
      label: 'Debit/Credit Card',
      description: 'Pay securely with Paystack',
      enabled: true,
    },
    {
      type: PaymentMethodEnum.CASH,
      icon: 'cash-outline',
      label: 'Cash on Delivery',
      description: 'Coming soon - Pay when you receive',
      enabled: false,
    },
  ];

  const handleCardNumberChange = (text: string) => {
    // Format card number with spaces every 4 digits
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (text: string) => {
    // Format expiry date as MM/YY
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length >= 2) {
      const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      setCardDetails({ ...cardDetails, expiryDate: formatted });
    } else {
      setCardDetails({ ...cardDetails, expiryDate: cleaned });
    }
  };

  const validateCardPayment = () => {
    if (selectedType !== PaymentMethodEnum.CARD) return true;

    if (!cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.cardHolderName.trim()) {
      Alert.alert('Error', 'Please enter the cardholder name');
      return false;
    }
    if (!cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateCardPayment()) return;

    try {
      setIsSaving(true);

      const payment = {
        id: Date.now().toString(),
        type: selectedType,
        ...(selectedType === PaymentMethodEnum.CARD && cardDetails),
        isDefault: saveCard,
      };

      // Set payment method in Redux for current session
      dispatch(setPaymentMethod(payment));
      
      // Save to local device storage if user checked the option
      if (saveCard && selectedType === PaymentMethodEnum.CARD) {
        // Only save last 4 digits of card number
        const last4Digits = cardDetails.cardNumber.replace(/\s/g, '').slice(-4);
        
        await LocalStorageService.savePaymentMethod({
          type: PaymentMethodEnum.CARD,
          cardNumber: last4Digits, // Save only last 4 digits
          cardHolderName: cardDetails.cardHolderName,
          expiryDate: cardDetails.expiryDate,
          isDefault: true,
        });
        
        Alert.alert(
          'Success',
          'Payment method saved to your device successfully!',
          [{ text: 'OK' }]
        );
      }
      
      router.push('/(routes)/cart/review');
    } catch (error) {
      console.error('Error saving payment method:', error);
      Alert.alert('Error', 'Failed to save payment method. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectSavedCard = (paymentMethod: SavedPaymentMethod) => {
    setCardDetails({
      cardNumber: `•••• •••• •••• ${paymentMethod.cardNumber}`, // Show masked
      cardHolderName: paymentMethod.cardHolderName || '',
      expiryDate: paymentMethod.expiryDate || '',
      cvv: '', // Always require CVV for security
    });
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this saved payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocalStorageService.deletePaymentMethod(methodId);
              await loadSavedPaymentMethods(); // Reload list
              Alert.alert('Success', 'Payment method deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete payment method');
            }
          },
        },
      ]
    );
  };

  const renderPaymentOption = (option: any) => {
    const isSelected = selectedType === option.type;
    const isDisabled = !option.enabled;
    
    return (
      <TouchableOpacity
        key={option.type}
        style={[
          styles.paymentOption, 
          isSelected && styles.paymentOptionSelected,
          isDisabled && styles.paymentOptionDisabled
        ]}
        onPress={() => option.enabled && setSelectedType(option.type)}
        disabled={isDisabled}
      >
        <View style={[
          styles.radioOuter, 
          isSelected && styles.radioOuterSelected,
          isDisabled && styles.radioOuterDisabled
        ]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        
        <View style={styles.paymentIcon}>
          <Ionicons 
            name={option.icon as any} 
            size={24} 
            color={isDisabled ? theme.tabIconDefault + '50' : isSelected ? theme.accent : theme.tabIconDefault} 
          />
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={[
            styles.paymentLabel, 
            isSelected && styles.paymentLabelSelected,
            isDisabled && styles.paymentLabelDisabled
          ]}>
            {option.label}
          </Text>
          <Text style={[
            styles.paymentDescription,
            isDisabled && styles.paymentDescriptionDisabled
          ]}>
            {option.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentOptions.map(renderPaymentOption)}
        </View>

        {/* Card Details Form (shown only when card is selected) */}
        {selectedType === PaymentMethodEnum.CARD && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            {/* Saved Cards */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.accent} />
                <Text style={styles.loadingText}>Loading saved cards...</Text>
              </View>
            ) : savedPaymentMethods.length > 0 ? (
              <View style={styles.savedCardsContainer}>
                <Text style={styles.savedCardsTitle}>Saved Cards on This Device</Text>
                {savedPaymentMethods.map((pm) => (
                  <View key={pm.id} style={styles.savedCardRow}>
                    <TouchableOpacity
                      style={styles.savedCard}
                      onPress={() => handleSelectSavedCard(pm)}
                    >
                      <MaterialCommunityIcons name="credit-card" size={24} color={theme.accent} />
                      <View style={styles.savedCardInfo}>
                        <Text style={styles.savedCardNumber}>
                          •••• {pm.cardNumber}
                        </Text>
                        <Text style={styles.savedCardName}>{pm.cardHolderName}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeletePaymentMethod(pm.id)}
                      style={styles.deletePaymentButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ff4757" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Card Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={theme.tabIconDefault}
                value={cardDetails.cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Name on card"
                placeholderTextColor={theme.tabIconDefault}
                value={cardDetails.cardHolderName}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, cardHolderName: text })
                }
                autoCapitalize="words"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Expiry Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={theme.tabIconDefault}
                  value={cardDetails.expiryDate}
                  onChangeText={handleExpiryChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>CVV *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={theme.tabIconDefault}
                  value={cardDetails.cvv}
                  onChangeText={(text) =>
                    setCardDetails({ ...cardDetails, cvv: text })
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveCardContainer}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[styles.checkbox, saveCard && styles.checkboxChecked]}>
                {saveCard && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <View style={styles.saveCardTextContainer}>
                <Text style={styles.saveCardText}>Save card on my device</Text>
                <Text style={styles.saveCardSubText}>
                  Only last 4 digits will be saved locally
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Paystack Info */}
        {selectedType === PaymentMethodEnum.CARD && (
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={24} color="#5cb85c" />
            <Text style={styles.infoText}>
              Your payment will be processed securely through Paystack. We accept Visa, Mastercard, and Verve cards.
            </Text>
          </View>
        )}

        {/* Security Info */}
        <View style={styles.securityBox}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#5cb85c" />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
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
              <Text style={styles.continueText}>Review Order</Text>
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
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    paymentOptionSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent + '10',
    },
    paymentOptionDisabled: {
      opacity: 0.5,
      backgroundColor: theme.tabIconDefault + '10',
    },
    radioOuter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.tabIconDefault,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    radioOuterSelected: {
      borderColor: theme.accent,
    },
    radioOuterDisabled: {
      borderColor: theme.tabIconDefault + '50',
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.accent,
    },
    paymentIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.tabIconDefault + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    paymentInfo: {
      flex: 1,
    },
    paymentLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    paymentLabelSelected: {
      color: theme.accent,
    },
    paymentLabelDisabled: {
      color: theme.tabIconDefault + '70',
    },
    paymentDescription: {
      fontSize: 13,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    paymentDescriptionDisabled: {
      color: theme.tabIconDefault + '50',
    },
    savedCardsContainer: {
      marginBottom: 20,
    },
    savedCardsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    savedCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    savedCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      borderRadius: 10,
      padding: 14,
      gap: 12,
    },
    savedCardInfo: {
      flex: 1,
    },
    savedCardNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    savedCardName: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
      marginTop: 2,
    },
    deletePaymentButton: {
      padding: 8,
      marginLeft: 8,
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    saveCardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.tabIconDefault,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    checkboxChecked: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    saveCardText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    saveCardTextContainer: {
      flex: 1,
    },
    saveCardSubText: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
      marginTop: 2,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    bankDetails: {
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 20,
    },
    bankLabel: {
      fontSize: 14,
      color: theme.tabIconDefault,
      marginTop: 12,
      fontFamily: fontFamilies.NunitoRegular,
    },
    bankValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginTop: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    bankNote: {
      flexDirection: 'row',
      backgroundColor: theme.accent + '15',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      gap: 8,
    },
    bankNoteText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      fontFamily: fontFamilies.NunitoRegular,
    },
    walletContainer: {
      alignItems: 'center',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 30,
    },
    walletBalance: {
      fontSize: 16,
      color: theme.tabIconDefault,
      marginTop: 16,
      fontFamily: fontFamilies.NunitoRegular,
    },
    walletAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.accent,
      marginTop: 8,
      fontFamily: fontFamilies.NunitoBold,
    },
    walletNote: {
      fontSize: 13,
      color: theme.tabIconDefault,
      marginTop: 12,
      textAlign: 'center',
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
    securityBox: {
      flexDirection: 'row',
      backgroundColor: '#5cb85c15',
      borderRadius: 12,
      padding: 16,
      margin: 20,
      marginTop: 10,
      gap: 12,
      alignItems: 'center',
    },
    securityText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
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

