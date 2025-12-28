# Paystack Integration Guide

## Setup Instructions

### 1. Install Paystack Package
```bash
npm install react-native-paystack-webview
```

### 2. Get Your API Keys
1. Sign up at https://dashboard.paystack.com/signup
2. Go to Settings → API Keys & Webhooks
3. Copy your:
   - Public Key (pk_test_xxxxx for test)
   - Secret Key (sk_test_xxxxx for test)

### 3. Configure Environment Variables
Add to your `.env` or `app.json`:
```
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
EXPO_PUBLIC_PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Important:** Never expose your Secret Key in the frontend code. Only use the Public Key in your mobile app.

---

## Integration in Payment Screen

### Update payment.tsx

Replace the card form section with Paystack payment:

```typescript
import { useRef, useState } from 'react';
import { Paystack } from 'react-native-paystack-webview';
import PaystackService from '@/apiServices/paystackService';

// Inside your component
const paystackWebViewRef = useRef<any>();
const { totalAmount } = useAppSelector(state => state.cart);
const { shippingAddress } = useAppSelector(state => state.order);

const handlePaystackSuccess = async (response: any) => {
  console.log('Payment success:', response);
  
  try {
    // Verify payment on backend
    const verification = await PaystackService.verifyPayment(response.reference);
    
    if (verification.status === 'success') {
      // Payment successful, save payment method
      dispatch(setPaymentMethod({
        id: response.reference,
        type: 'card',
        reference: response.reference,
        transactionId: response.trans,
        cardNumber: '****', // Paystack doesn't return card details for security
      }));
      
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully!',
        [{ 
          text: 'Continue',
          onPress: () => router.push('/(routes)/cart/review')
        }]
      );
    } else {
      Alert.alert('Verification Failed', 'Unable to verify payment. Please contact support.');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    Alert.alert('Error', 'Failed to verify payment');
  }
};

const handlePaystackCancel = () => {
  Alert.alert('Payment Cancelled', 'You cancelled the payment process');
};

// In your render
{selectedType === 'card' && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Pay with Card</Text>
    <Text style={styles.paymentDescription}>
      Pay securely with your debit or credit card through Paystack
    </Text>
    
    <TouchableOpacity
      style={styles.paystackButton}
      onPress={() => paystackWebViewRef.current?.startTransaction()}
    >
      <Ionicons name="card" size={24} color="#fff" />
      <Text style={styles.paystackButtonText}>Pay ₦{totalAmount.toLocaleString()}</Text>
    </TouchableOpacity>
    
    {/* Paystack WebView Component */}
    <Paystack
      paystackKey={PaystackService.getPublicKey()}
      billingEmail={shippingAddress?.email || 'customer@closebuy.com'}
      billingName={shippingAddress?.fullName || 'Customer'}
      billingMobile={shippingAddress?.phoneNumber || ''}
      amount={PaystackService.toKobo(totalAmount)}
      currency="NGN"
      channels={['card', 'bank', 'ussd', 'mobile_money']}
      onCancel={handlePaystackCancel}
      onSuccess={handlePaystackSuccess}
      ref={paystackWebViewRef}
    />
  </View>
)}
```

---

## Alternative: WebView Integration

If you prefer more control, use WebView with Paystack inline:

```typescript
import { WebView } from 'react-native-webview';
import { Modal } from 'react-native';

const [paymentUrl, setPaymentUrl] = useState('');
const [showWebView, setShowWebView] = useState(false);

const initiatePayment = async () => {
  const paymentData = {
    amount: totalAmount,
    email: shippingAddress?.email || 'customer@closebuy.com',
    phone: shippingAddress?.phoneNumber || '',
    name: shippingAddress?.fullName || 'Customer',
    callback_url: 'closebuy://payment-callback',
  };

  const result = await PaystackService.initializePayment(paymentData);
  
  if (result.status === 'success' && result.data?.authorization_url) {
    setPaymentUrl(result.data.authorization_url);
    setShowWebView(true);
  } else {
    Alert.alert('Error', result.message);
  }
};

// WebView component
{showWebView && (
  <Modal visible={showWebView} animationType="slide">
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.webViewHeader}>
        <TouchableOpacity onPress={() => setShowWebView(false)}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.webViewTitle}>Complete Payment</Text>
        <View style={{ width: 24 }} />
      </View>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          // Check if redirected back to app
          if (navState.url.includes('payment-callback') || navState.url.includes('reference=')) {
            const url = navState.url;
            const reference = url.match(/reference=([^&]+)/)?.[1];
            
            setShowWebView(false);
            
            if (reference) {
              // Verify payment
              handlePaymentVerification(reference);
            }
          }
        }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  </Modal>
)}
```

---

## Testing

### Test Cards
Use these cards in test mode:

**Successful Payment:**
- Card Number: 5060666666666666666
- CVV: 123
- Expiry: Any future date (e.g., 12/25)
- PIN: 1234

**Insufficient Funds:**
- Card Number: 5061020000000000094
- CVV: 123
- Expiry: Any future date
- PIN: 1234

**Declined Transaction:**
- Card Number: 5060990580000217499
- CVV: 123
- Expiry: Any future date
- PIN: 1234

### Test Mode
- Always use TEST keys during development (pk_test_xxx and sk_test_xxx)
- Switch to LIVE keys only in production (pk_live_xxx and sk_live_xxx)
- Test different payment scenarios (success, failure, cancellation)

---

## Backend Webhook

Set up webhook to receive payment notifications on your backend:

```typescript
// On your backend
import crypto from 'crypto';

app.post('/api/webhooks/paystack', async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Unauthorized');
  }
  
  const event = req.body;
  
  if (event.event === 'charge.success') {
    const { reference, amount, customer } = event.data;
    
    // Update order status in database
    await updateOrderPaymentStatus(reference, 'paid', {
      amount: amount / 100, // Convert from kobo to naira
      email: customer.email,
      paidAt: new Date(),
    });
    
    // Send confirmation email/notification to customer
    await sendPaymentConfirmation(customer.email, reference);
  }
  
  res.status(200).send('OK');
});
```

**Webhook Setup:**
1. Go to Settings → API Keys & Webhooks in Paystack Dashboard
2. Add your webhook URL: `https://your-backend.com/api/webhooks/paystack`
3. Copy the webhook secret and save it as `PAYSTACK_WEBHOOK_SECRET`

---

## Security Best Practices

1. **Never expose Secret Key in frontend**
   - Only use Public Key in mobile app
   - Keep Secret Key on backend only
   - Use environment variables

2. **Always verify payments on backend**
   - Don't trust frontend verification alone
   - Use webhook for real-time updates
   - Verify payment status before fulfilling orders

3. **Use transaction references**
   - Generate unique reference for each transaction
   - Store in database for tracking
   - Use format: `CB-{timestamp}-{random}`

4. **Handle payment states properly**
   - Pending
   - Success
   - Failed
   - Abandoned

5. **Validate amounts**
   - Verify amount on backend matches order total
   - Handle currency conversions properly (kobo ↔ naira)

---

## Payment Flow

```
1. User selects items and proceeds to checkout
   ↓
2. User enters shipping information
   ↓
3. User clicks "Pay with Card"
   ↓
4. Initialize payment with Paystack API
   ↓
5. Show Paystack payment page (WebView)
   ↓
6. User enters card details and completes payment
   ↓
7. Paystack processes payment and redirects
   ↓
8. App receives callback with reference
   ↓
9. Verify payment on backend using reference
   ↓
10. Update order status to "Paid"
   ↓
11. Show success screen and clear cart
   ↓
12. Send confirmation email/push notification
```

---

## Error Handling

```typescript
try {
  const result = await PaystackService.initializePayment(paymentData);
  
  if (result.status === 'success') {
    // Proceed with payment
    setPaymentUrl(result.data.authorization_url);
  } else {
    // Handle specific errors
    switch (result.message) {
      case 'Invalid email':
        Alert.alert('Error', 'Please provide a valid email address');
        break;
      case 'Invalid amount':
        Alert.alert('Error', 'Payment amount is invalid');
        break;
      default:
        Alert.alert('Payment Error', result.message);
    }
  }
} catch (error) {
  console.error('Payment error:', error);
  Alert.alert(
    'Error',
    'Unable to process payment. Please check your internet connection and try again.'
  );
}
```

---

## Refunds

To process refunds (backend only):

```typescript
const refundPayment = async (transactionId: string, amount?: number) => {
  const response = await fetch('https://api.paystack.co/refund', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transaction: transactionId,
      amount: amount ? amount * 100 : undefined, // Partial refund or full
    }),
  });
  
  return await response.json();
};
```

---

## Production Checklist

- [ ] Replace TEST keys with LIVE keys in environment variables
- [ ] Test with real cards in test mode
- [ ] Set up webhook endpoint on production server
- [ ] Configure proper callback/redirect URLs
- [ ] Add comprehensive error logging (Sentry, LogRocket, etc.)
- [ ] Set up payment failure notifications to admin
- [ ] Add email/SMS payment notifications to customers
- [ ] Test refund process
- [ ] Test on both iOS and Android devices
- [ ] Add payment receipt generation
- [ ] Configure SSL certificate for backend
- [ ] Set up monitoring for failed payments
- [ ] Add analytics for payment funnel
- [ ] Test with poor network conditions
- [ ] Add payment timeout handling

---

## Styling the Payment Button

Add these styles for the Paystack button:

```typescript
paystackButton: {
  flexDirection: 'row',
  backgroundColor: '#00C3F7', // Paystack brand color
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  marginTop: 20,
  shadowColor: '#00C3F7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
paystackButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  fontFamily: fontFamilies.NunitoSemiBold,
},
paymentDescription: {
  fontSize: 14,
  color: theme.tabIconDefault,
  marginBottom: 12,
  fontFamily: fontFamilies.NunitoRegular,
  lineHeight: 20,
},
```

---

## Support & Documentation

- **Paystack Docs:** https://paystack.com/docs
- **API Reference:** https://paystack.com/docs/api
- **React Native Package:** https://www.npmjs.com/package/react-native-paystack-webview
- **Support Email:** support@paystack.com
- **Community:** https://paystack.com/community

---

## Common Issues & Solutions

### Issue: Payment not completing
**Solution:** Check that your callback URL is properly configured in the Paystack dashboard and app deep linking is set up.

### Issue: WebView not showing
**Solution:** Ensure `react-native-webview` is installed: `npm install react-native-webview`

### Issue: "Invalid public key"
**Solution:** Verify you're using the correct key for your environment (test vs live).

### Issue: Amount showing as 0
**Solution:** Remember to multiply amount by 100 to convert to kobo.

---

**Remember:** Always test thoroughly in test mode before going live with real transactions!

## Nigerian Payment Channels

Paystack supports multiple payment channels in Nigeria:

- **Card:** Visa, Mastercard, Verve
- **Bank Transfer:** Direct bank transfer
- **USSD:** Pay using USSD codes
- **Mobile Money:** MTN, Airtel, etc.
- **QR Code:** Scan to pay

You can customize which channels to show by modifying the `channels` array in the payment initialization.

