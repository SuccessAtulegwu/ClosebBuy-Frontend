import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { placeOrder, calculateTax } from '@/redux/slices/orderSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { fontFamilies } from '@/constants/app.constants';

export default function ReviewOrderScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, deliveryFee, tax, loading } = useAppSelector(
    (state) => state.order
  );
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate tax based on subtotal
  React.useEffect(() => {
    dispatch(calculateTax(totalAmount));
  }, [totalAmount]);

  const subtotal = totalAmount;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      Alert.alert('Error', 'Missing shipping or payment information');
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
    };

    try {
      const result = await dispatch(placeOrder(orderData)).unwrap();
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Navigate to success screen
      router.replace({
        pathname: '/(routes)/cart/success',
        params: { orderId: result.id, orderNumber: result.orderNumber },
      });
    } catch (error: any) {
      Alert.alert('Order Failed', error || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod?.type) {
      case 'card':
        return `Card ending in ${paymentMethod.cardNumber?.slice(-4)}`;
      case 'cash':
        return 'Cash on Delivery';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'wallet':
        return 'Digital Wallet';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({items.length})</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ₦{(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={24} color={theme.accent} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoName}>{shippingAddress?.fullName}</Text>
              <Text style={styles.infoText}>{shippingAddress?.phoneNumber}</Text>
              <Text style={styles.infoText}>
                {shippingAddress?.address}, {shippingAddress?.city}
              </Text>
              <Text style={styles.infoText}>
                {shippingAddress?.state}, {shippingAddress?.country}
              </Text>
              {shippingAddress?.zipCode && (
                <Text style={styles.infoText}>{shippingAddress.zipCode}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={
                  paymentMethod?.type === 'card'
                    ? 'card'
                    : paymentMethod?.type === 'cash'
                    ? 'cash'
                    : paymentMethod?.type === 'wallet'
                    ? 'wallet'
                    : 'business'
                }
                size={24}
                color={theme.accent}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoName}>{getPaymentMethodLabel()}</Text>
              {paymentMethod?.type === 'card' && (
                <Text style={styles.infoText}>{paymentMethod.cardHolderName}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
              <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₦{deliveryFee.toLocaleString()}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (7.5%)</Text>
              <Text style={styles.summaryValue}>₦{tax.toFixed(2)}</Text>
            </View>
            
            {paymentMethod?.type === 'cash' && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee (COD)</Text>
                <Text style={styles.summaryValue}>₦100</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₦{(total + (paymentMethod?.type === 'cash' ? 100 : 0)).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Ionicons name="information-circle-outline" size={20} color={theme.tabIconDefault} />
          <Text style={styles.termsText}>
            By placing this order, you agree to our{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomTotal}>
            ₦{(total + (paymentMethod?.type === 'cash' ? 100 : 0)).toLocaleString()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      fontFamily: fontFamilies.NunitoBold,
    },
    editText: {
      fontSize: 14,
      color: theme.accent,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    orderItem: {
      flexDirection: 'row',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      alignItems: 'center',
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    itemQuantity: {
      fontSize: 13,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    itemPrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accent + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    infoContent: {
      flex: 1,
    },
    infoName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 6,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    infoText: {
      fontSize: 14,
      color: theme.tabIconDefault,
      marginBottom: 2,
      fontFamily: fontFamilies.NunitoRegular,
    },
    summaryCard: {
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    divider: {
      height: 1,
      backgroundColor: theme.tabIconDefault + '30',
      marginVertical: 12,
    },
    totalRow: {
      marginBottom: 0,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.accent,
      fontFamily: fontFamilies.NunitoBold,
    },
    termsContainer: {
      flexDirection: 'row',
      padding: 20,
      paddingTop: 10,
      gap: 10,
    },
    termsText: {
      flex: 1,
      fontSize: 12,
      color: theme.tabIconDefault,
      lineHeight: 18,
      fontFamily: fontFamilies.NunitoRegular,
    },
    termsLink: {
      color: theme.accent,
      textDecorationLine: 'underline',
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    bottomLeft: {
      flex: 1,
    },
    bottomLabel: {
      fontSize: 12,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    bottomTotal: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: fontFamilies.NunitoBold,
    },
    placeOrderButton: {
      flexDirection: 'row',
      backgroundColor: theme.accent,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      gap: 8,
    },
    placeOrderButtonDisabled: {
      opacity: 0.6,
    },
    placeOrderText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
  });
}

