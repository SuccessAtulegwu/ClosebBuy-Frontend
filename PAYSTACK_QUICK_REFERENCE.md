# Paystack Quick Reference Card

## 🚨 CRITICAL RULES

```typescript
// ❌ NEVER
const SECRET_KEY = 'sk_live_xxxxx'; // In frontend!
const amount = req.body.amount;     // Trust frontend!
PaystackService.verifyPayment();    // Verify on frontend!

// ✅ ALWAYS
// Secret key on backend only
// Fetch amount from database
// Verify on backend only
```

---

## 📞 Quick Contacts

**Paystack Support**: support@paystack.com  
**Dashboard**: https://dashboard.paystack.com  
**Test Cards**: 4084084084084081 (success), 5060666666666666666 (decline)

---

## 🔑 Environment Variables

```env
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
EXPO_PUBLIC_API_URL=https://your-api.com/v1
```

---

## 💻 Quick Implementation

### 1. Initialize Payment
```typescript
import { useAppDispatch } from '@/redux/hooks';
import { initializePayment } from '@/redux/slices/paymentSlice';

const dispatch = useAppDispatch();

const result = await dispatch(initializePayment({
  orderId: 123,
  amount: 1000,
  email: 'user@email.com',
  phone: '08012345678',
  name: 'John Doe',
})).unwrap();

console.log('Reference:', result.reference);
```

### 2. Show Payment Modal
```typescript
import { SecurePaymentModal } from '@/components/SecurePaymentModal';

<SecurePaymentModal
  visible={showPayment}
  orderId={order.id}
  amount={order.total}
  email={user.email}
  onSuccess={(ref) => console.log('Paid!', ref)}
  onCancel={() => setShowPayment(false)}
  onError={(error) => Alert.alert('Error', error)}
/>
```

### 3. Verify Payment
```typescript
import { verifyPayment } from '@/redux/slices/paymentSlice';

const result = await dispatch(verifyPayment(reference)).unwrap();

if (result.status === PaymentStatus.SUCCESS) {
  // Payment confirmed!
}
```

---

## 🎯 Payment Flow

```
1. User clicks "Pay"
2. Initialize (backend creates reference)
3. Show Paystack WebView
4. User pays
5. Verify (backend confirms with Paystack)
6. Show success/failure
7. Webhook confirms (async)
```

---

## 🛡️ Security Checklist

- [ ] Secret key only on backend
- [ ] Amount from database
- [ ] Verify on backend
- [ ] Webhook signature check
- [ ] HTTPS everywhere
- [ ] Rate limiting
- [ ] Authentication required

---

## ⚠️ Common Errors

### "Secret key invalid"
➜ Secret key in frontend code (move to backend!)

### "Amount mismatch"
➜ Backend trusting frontend amount (use database!)

### "Verification timeout"
➜ Normal for slow networks (webhook will confirm)

### "Payment initialized but not completed"
➜ User cancelled or network issue (safe to retry)

---

## 📊 Testing

### Test Mode
```typescript
// Use test keys
pk_test_xxxxx
sk_test_xxxxx

// Test cards
4084084084084081 (success)
5060666666666666666 (declined)
```

### Test Scenarios
- Successful payment ✓
- Card declined ✓
- Network failure ✓
- Cancellation ✓
- Timeout ✓

---

## 🔧 Backend Endpoints Needed

```typescript
POST   /payments/initialize
GET    /payments/verify/:reference  
POST   /webhooks/paystack
GET    /payments/status/:orderId
POST   /payments/refund
```

---

## 📱 Redux State

```typescript
// Access payment state
const payment = useAppSelector(state => state.payment);

payment.reference    // Payment reference
payment.status       // PaymentStatus enum
payment.loading      // Boolean
payment.error        // Error message
payment.retryCount   // Number of retries
```

---

## 🎨 Payment Statuses

```typescript
import { PaymentStatus } from '@/types/publicenums';

PaymentStatus.PENDING   // Awaiting payment
PaymentStatus.SUCCESS   // Payment confirmed
PaymentStatus.FAILED    // Payment failed
PaymentStatus.REFUNDED  // Payment refunded
```

---

## 🔄 Retry Logic

```
Auto-retry on:
- Network errors
- Timeout errors
- Temporary failures

Max attempts: 3
Delay: 2 seconds between attempts
```

---

## 📝 Logging

```typescript
// Log these events
console.log('Payment initiated', { orderId, amount });
console.log('Payment initialized', { reference });
console.log('Payment success', { reference, amount });
console.error('Payment failed', { reference, error });
```

---

## 🎓 Learn More

- `PAYSTACK_SECURITY_GUIDE.md` - Complete guide
- `PAYSTACK_IMPLEMENTATION.md` - Quick start
- `PAYMENT_IMPLEMENTATION_SUMMARY.md` - Overview

---

## ⚡ Quick Debug

```typescript
// Check payment state
console.log('Payment state:', store.getState().payment);

// Check if authenticated
console.log('Auth token:', store.getState().auth.token);

// Check order
console.log('Current order:', store.getState().order.currentOrder);
```

---

**Remember**: Security first! Always verify on backend!

