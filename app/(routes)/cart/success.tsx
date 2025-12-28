import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { fontFamilies } from '@/constants/app.constants';
import { MotiView } from 'moti';

export default function OrderSuccessScreen() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const orderNumber = params.orderNumber as string;
  const orderId = params.orderId as string;

  useEffect(() => {
    // Optional: Play success sound or haptic feedback
  }, []);

  const handleTrackOrder = () => {
    router.replace('/(tabs)/orders');
  };

  const handleContinueShopping = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <MotiView
        from={{ scale: 0, rotate: '0deg' }}
        animate={{ scale: 1, rotate: '360deg' }}
        transition={{
          type: 'timing',
          duration: 800,
        }}
        style={styles.iconContainer}
      >
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={60} color="#fff" />
        </View>
      </MotiView>

      {/* Success Message */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 400,
        }}
      >
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Your order has been confirmed and will be delivered soon
        </Text>
      </MotiView>

      {/* Order Details */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 600,
        }}
        style={styles.orderDetailsCard}
      >
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Number</Text>
          <Text style={styles.detailValue}>{orderNumber}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID</Text>
          <Text style={styles.detailValue}>#{orderId?.slice(0, 8)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Estimated Delivery</Text>
          <Text style={styles.detailValue}>3-5 Business Days</Text>
        </View>
      </MotiView>

      {/* Info Box */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 800,
        }}
        style={styles.infoBox}
      >
        <Ionicons name="mail-outline" size={24} color={theme.accent} />
        <Text style={styles.infoText}>
          A confirmation email has been sent to your registered email address
        </Text>
      </MotiView>

      {/* Action Buttons */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 1000,
        }}
        style={styles.buttonsContainer}
      >
        <TouchableOpacity
          style={styles.trackButton}
          onPress={handleTrackOrder}
        >
          <Ionicons name="location-outline" size={20} color="#fff" />
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Additional Actions */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 1200,
        }}
        style={styles.additionalActions}
      >
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={theme.accent} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <View style={styles.actionDivider} />
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color={theme.accent} />
          <Text style={styles.actionText}>Download Receipt</Text>
        </TouchableOpacity>
        
        <View style={styles.actionDivider} />
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={20} color={theme.accent} />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Decorative Confetti (Optional) */}
      <View style={styles.confettiContainer}>
        {[...Array(20)].map((_, i) => (
          <MotiView
            key={i}
            from={{
              translateY: -100,
              rotate: '0deg',
              opacity: 0,
            }}
            animate={{
              translateY: 600,
              rotate: `${Math.random() * 360}deg`,
              opacity: [0, 1, 0],
            }}
            transition={{
              type: 'timing',
              duration: 2000 + Math.random() * 1000,
              delay: Math.random() * 500,
              loop: false,
            }}
            style={[
              styles.confetti,
              {
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#5cb85c', '#ff4757', '#ffa500', '#3498db'][
                  Math.floor(Math.random() * 4)
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function getStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    iconContainer: {
      marginBottom: 30,
    },
    successCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#5cb85c',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#5cb85c',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 12,
      fontFamily: fontFamilies.NunitoBold,
    },
    subtitle: {
      fontSize: 16,
      color: theme.tabIconDefault,
      textAlign: 'center',
      marginBottom: 30,
      paddingHorizontal: 20,
      lineHeight: 24,
      fontFamily: fontFamilies.NunitoRegular,
    },
    orderDetailsCard: {
      width: '100%',
      backgroundColor: theme.cardcolor,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.tabIconDefault,
      fontFamily: fontFamilies.NunitoRegular,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    divider: {
      height: 1,
      backgroundColor: theme.tabIconDefault + '30',
      marginVertical: 8,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.accent + '15',
      borderRadius: 12,
      padding: 16,
      marginBottom: 30,
      gap: 12,
      alignItems: 'center',
      width: '100%',
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      lineHeight: 20,
      fontFamily: fontFamilies.NunitoRegular,
    },
    buttonsContainer: {
      width: '100%',
      gap: 12,
      marginBottom: 20,
    },
    trackButton: {
      flexDirection: 'row',
      backgroundColor: theme.accent,
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    trackButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    continueButton: {
      backgroundColor: theme.cardcolor,
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.accent,
    },
    continueButtonText: {
      color: theme.accent,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fontFamilies.NunitoSemiBold,
    },
    additionalActions: {
      flexDirection: 'row',
      backgroundColor: theme.cardcolor,
      borderRadius: 12,
      padding: 12,
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    actionButton: {
      alignItems: 'center',
      padding: 8,
      flex: 1,
    },
    actionText: {
      fontSize: 12,
      color: theme.accent,
      marginTop: 4,
      fontFamily: fontFamilies.NunitoRegular,
    },
    actionDivider: {
      width: 1,
      height: 40,
      backgroundColor: theme.tabIconDefault + '30',
    },
    confettiContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      pointerEvents: 'none',
    },
    confetti: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
}

