# Paystack Implementation Quick Start

## 🚀 Quick Setup (5 Steps)

### 1. **Install Dependencies**
```bash
npm install react-native-paystack-webview
```

### 2. **Set Environment Variables**
Add to your `.env`:
```env
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_key
EXPO_PUBLIC_API_URL=https://your-backend-api.com/v1
```

### 3. **Update Redux Store**
The payment slice has been added to your store:
```typescript
// Already configured in redux/store.ts
import paymentReducer from './slices/paymentReducer';
```

### 4. **Create Backend Endpoints**
Your backend MUST have these endpoints:

**POST /payments/initialize**
```json
{
  "orderId": 123,
  "amount": 1000,
  "email": "customer@email.com",
  "phone": "08012345678",
  "name": "John Doe"
}
```

**GET /payments/verify/:reference**
Returns payment status and details.

**POST /webhooks/paystack**
Receives Paystack webhook events.

### 5. **Use in Your Payment Screen**

```typescript
import { SecurePaymentModal } from '@/components/SecurePaymentModal';

// In your component
const [showPayment, setShowPayment] = useState(false);

<SecurePaymentModal
  visible={showPayment}
  orderId={order.id}
  amount={order.total}
  email={user.email}
  phone={user.phone}
  name={user.name}
  onSuccess={(ref) => {
    console.log('Payment successful:', ref);
    navigation.navigate('OrderSuccess');
  }}
  onCancel={() => setShowPayment(false)}
  onError={(error) => Alert.alert('Error', error)}
/>
```

---

## 🎯 What You Get

### ✅ Security Features
- ✅ Secret keys never exposed in frontend
- ✅ All verification done on backend
- ✅ Automatic retry on network failures (3 attempts)
- ✅ Timeout protection (30 seconds)
- ✅ Payment status validation
- ✅ Idempotency support
- ✅ Rate limiting ready

### ✅ User Experience
- ✅ Loading states during initialization
- ✅ Loading states during verification
- ✅ Clear error messages
- ✅ Retry options
- ✅ Cancel support
- ✅ Timeout handling
- ✅ Support for all Paystack payment channels (card, bank, USSD, QR)

### ✅ Error Handling
- ✅ Network errors → Automatic retry
- ✅ Card declined → Clear message
- ✅ Verification timeout → Status check guidance
- ✅ Unknown errors → Support contact
- ✅ Duplicate payment prevention

---

## 📋 Files Created/Updated

### New Files
1. `closebuy/apiServices/securePaymentService.ts` - Secure API service
2. `closebuy/redux/slices/paymentSlice.ts` - Payment state management
3. `closebuy/components/SecurePaymentModal.tsx` - Payment UI component
4. `closebuy/PAYSTACK_SECURITY_GUIDE.md` - Complete security guide
5. `closebuy/PAYSTACK_IMPLEMENTATION.md` - This file

### Updated Files
1. `closebuy/redux/store.ts` - Added payment reducer

---

## 🛡️ Critical Security Rules

### ❌ NEVER DO THIS:
```typescript
// DON'T: Verify payment on frontend
const verified = await PaystackService.verifyPayment(reference);
```

### ✅ ALWAYS DO THIS:
```typescript
// DO: Verify payment on backend
const result = await SecurePaymentService.verifyPayment(reference, token);
```

### ❌ NEVER DO THIS:
```typescript
// DON'T: Trust amount from frontend
const amount = req.body.amount; // ❌ Can be manipulated
```

### ✅ ALWAYS DO THIS:
```typescript
// DO: Get amount from your database
const order = await db.orders.findById(orderId);
const amount = order.total; // ✅ Safe
```

---

## 🔄 Payment Flow Diagram

```
1. User clicks "Pay Now"
   ↓
2. App → Backend: "Initialize payment for order #123"
   ↓
3. Backend → Paystack: "Initialize ₦1,000 payment"
   ↓
4. Paystack → Backend: "Reference: TRX-123456"
   ↓
5. Backend → App: "Use reference TRX-123456"
   ↓
6. App shows Paystack WebView
   ↓
7. User enters card details
   ↓
8. Paystack processes payment
   ↓
9. Paystack → App: "Payment success"
   ↓
10. App → Backend: "Verify TRX-123456"
   ↓
11. Backend → Paystack: "Confirm TRX-123456 status"
   ↓
12. Paystack → Backend: "Status: SUCCESS, Amount: ₦1,000"
   ↓
13. Backend validates amount matches order
   ↓
14. Backend updates order status to "PAID"
   ↓
15. Backend → App: "Payment confirmed"
   ↓
16. App shows success screen
   ↓
17. (Later) Paystack → Backend Webhook: "Final confirmation"
   ↓
18. Backend logs webhook event
```

---

## 🧪 Testing Checklist

### Test with Paystack Test Keys
```
Public Key: pk_test_xxxxxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxxxxx
```

### Test Scenarios
- [ ] Successful card payment
- [ ] Successful bank transfer
- [ ] Card declined
- [ ] Network failure during payment
- [ ] Network failure during verification
- [ ] Payment cancellation
- [ ] Verification timeout
- [ ] Double payment attempt
- [ ] Invalid amount
- [ ] Unauthorized access

### Test Cards (Paystack)
```
Success: 4084084084084081
Declined: 5060666666666666666
```

---

## 📊 Monitoring & Logging

### Log These Events
```typescript
// Payment started
console.log('Payment initiated', { orderId, amount, userId });

// Payment initialized
console.log('Payment initialized', { reference, orderId });

// Payment success
console.log('Payment success', { reference, amount, orderId });

// Payment failed
console.error('Payment failed', { reference, error, orderId });

// Verification retry
console.warn('Verification retry', { reference, attempt });
```

### Monitor These Metrics
- Payment success rate
- Average verification time
- Failed payment reasons
- Retry attempts
- Timeout occurrences

---

## 🆘 Common Issues & Solutions

### Issue: "Payment initialized but not verified"
**Solution**: Check backend logs. Webhook might be delayed. Payment will be confirmed when webhook arrives.

### Issue: "Secret key error"
**Solution**: Make sure secret key is ONLY on backend, not in frontend code.

### Issue: "Amount mismatch"
**Solution**: Backend must fetch amount from database, not trust frontend.

### Issue: "Verification timeout"
**Solution**: Normal for slow networks. Webhook will confirm eventually. Show "checking status" message.

### Issue: "Double payment"
**Solution**: Implement payment lock and check order status before initializing.

---

## 📞 Support

### Paystack Support
- Dashboard: https://dashboard.paystack.com
- Docs: https://paystack.com/docs
- Support: support@paystack.com

### Implementation Help
- Check `PAYSTACK_SECURITY_GUIDE.md` for detailed security info
- Check `TYPE_SYSTEM_UPDATE.md` for type definitions
- Check Redux slices for state management examples

---

## 🎓 Next Steps

1. **Create backend endpoints** (most important!)
2. **Test with Paystack test keys**
3. **Implement webhook handler on backend**
4. **Test all error scenarios**
5. **Monitor payment metrics**
6. **Switch to live keys when ready**

---

**Remember**: Security first! Always verify on the backend!

