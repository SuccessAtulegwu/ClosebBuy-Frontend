# Complete Checkout & Payment Integration Guide

## 🎯 Overview

This guide explains the complete Cart → Checkout → Order → Payment flow in the CloseBuy app, integrated with the HMB NestJS backend and Paystack payment gateway.

---

## 📦 Installation

### 1. Install Required Dependencies

```bash
cd closebuy
npm install react-native-paystack-webview
```

### 2. Environment Variables

Create/update `.env` file:

```env
# Backend API
EXPO_PUBLIC_API_URL=http://your-backend-url.com/api

# Paystack Keys (Get from https://dashboard.paystack.com)
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

⚠️ **NEVER** put secret keys in the frontend!

---

## 🔄 Complete Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CHECKOUT FLOW                           │
└─────────────────────────────────────────────────────────────┘

1. CART (cart.tsx)
   └─> User views cart items
   └─> "Proceed to Checkout" button

2. SHIPPING (shipping.tsx)
   └─> User enters/selects delivery address
   └─> Address saved in Redux + Local Storage
   └─> Navigate to Payment

3. PAYMENT METHOD (payment.tsx)
   └─> User selects payment method (Card/Cash)
   └─> Card details entered (but not stored)
   └─> Payment method saved in Redux
   └─> Navigate to Review

4. REVIEW & PLACE ORDER (review.tsx) ⭐
   └─> Display: Items, Address, Payment, Total
   └─> Click "Place Order" button
   │
   ├─> usePaymentFlow Hook (hooks/usePaymentFlow.ts)
   │   │
   │   ├─> Step 1: Create Order in Backend
   │   │   └─> POST /orders (OrderService.createOrder)
   │   │   └─> Order created with status: PENDING
   │   │   └─> Returns: orderId, orderNumber
   │   │
   │   ├─> Step 2: Initialize Payment
   │   │   └─> POST /payments/initialize (SecurePaymentService)
   │   │   └─> Backend calls Paystack API
   │   │   └─> Returns: reference, publicKey
   │   │
   │   └─> Step 3: Open Paystack WebView
   │       └─> User completes payment
   │       │
   │       ├─> onSuccess → verifyPayment()
   │       │   └─> GET /payments/verify/:reference
   │       │   └─> Backend verifies with Paystack
   │       │   └─> Order status → CONFIRMED
   │       │   └─> Payment status → SUCCESS
   │       │   └─> Clear cart
   │       │   └─> Navigate to Success Screen
   │       │
   │       └─> onCancel → handlePaymentCancel()
   │           └─> Order remains PENDING
   │           └─> User can retry from Orders page

5. SUCCESS (success.tsx)
   └─> Display order confirmation
   └─> Order number, reference, estimated delivery
   └─> Navigate to Orders or Home
```

---

## 📁 File Structure & Responsibilities

### **Frontend (CloseBuy)**

```
closebuy/
├── app/(routes)/cart/
│   ├── cart.tsx              # Cart screen (view items)
│   ├── shipping.tsx          # Delivery address form
│   ├── payment.tsx           # Payment method selection
│   ├── review.tsx            # Order review + payment processing ⭐
│   └── success.tsx           # Order confirmation
│
├── hooks/
│   └── usePaymentFlow.ts     # Complete payment logic ⭐
│
├── apiServices/
│   ├── orderService.ts       # Order API calls
│   └── securePaymentService.ts  # Payment API calls
│
├── redux/slices/
│   ├── cartSlice.ts          # Cart state management
│   ├── orderSlice.ts         # Order state management
│   └── authSlice.ts          # User authentication
│
└── types/
    ├── publicTypes.ts        # Shared types
    ├── publicenums.ts        # Shared enums
    └── publicDTOTypes.ts     # DTOs for API
```

### **Backend (HMB)**

```
hmb/src/
├── payment/
│   ├── payment.controller.ts    # Payment endpoints
│   ├── payment.service.ts       # Payment business logic
│   ├── paystack.service.ts      # Paystack API integration
│   └── dto/paystack.dto.ts      # Payment DTOs
│
└── order/
    ├── order.controller.ts      # Order endpoints
    ├── order.service.ts         # Order business logic
    └── dto/order.dto.ts         # Order DTOs
```

---

## 🔧 Implementation Details

### 1. **Cart Management** (`redux/slices/cartSlice.ts`)

```typescript
// State
interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Actions
addToCart(product)
incrementQuantity(id)
decrementQuantity(id)
removeFromCart(id)
clearCart()
```

### 2. **Order Flow Hook** (`hooks/usePaymentFlow.ts`)

```typescript
const { 
  processCheckout,      // Creates order + initializes payment
  verifyPayment,        // Verifies payment on backend
  handlePaymentCancel,  // Handles cancel/failure
  isProcessing,         // Loading state
  currentStep           // Current step message
} = usePaymentFlow();
```

#### Key Function: `processCheckout()`

```typescript
async processCheckout(): Promise<{
  success: boolean;
  orderId?: number;
  orderNumber?: string;
  reference?: string;
  error?: string;
}>
```

**What it does:**
1. Creates order in backend with status `PENDING`
2. Initializes Paystack payment (backend generates reference)
3. Returns payment data for Paystack WebView

#### Key Function: `verifyPayment(reference, orderId, orderNumber)`

```typescript
async verifyPayment(
  reference: string,
  orderId: number,
  orderNumber: string
): Promise<boolean>
```

**What it does:**
1. Calls backend to verify payment with Paystack
2. Backend updates order status to `CONFIRMED`
3. Clears cart on success
4. Navigates to success screen

---

## 🔐 Security Flow

### Frontend → Backend → Paystack

```
Frontend (CloseBuy)                Backend (HMB)                 Paystack
─────────────────────              ─────────────                 ────────

1. Create Order
   POST /orders ──────────────────> ✓ Create Order
                                    ✓ status: PENDING
                <────────────────── orderId: 123

2. Initialize Payment
   POST /payments/initialize ─────> ✓ Validate amount
   {                                 ✓ Check order exists
     orderId: 123,                  ✓ Use SECRET_KEY
     amount: 5000,                  ✓ Generate reference
     email: user@example.com        ──────────────────────────> Initialize
   }                                                             Transaction
                                    <────────────────────────── authorization_url
                <────────────────── reference: ref_abc123       access_code
                                    publicKey: pk_test_xxx

3. User Pays (Paystack WebView)
   [User enters card]               
   [Payment processed]              
   ✓ onSuccess(response)

4. Verify Payment
   GET /payments/verify/ref_abc123 > ✓ Use SECRET_KEY
                                    ✓ Verify with Paystack ───> Verify
                                    ✓ Check amount matches        Transaction
                                    <────────────────────────── ✓ Success
                                    ✓ Update Order status        ✓ Amount
                                    ✓ Update Payment status      ✓ Paid At
                                    ✓ status: CONFIRMED
                <────────────────── ✓ Payment verified
```

### Why This is Secure

✅ **Secret key NEVER leaves backend**  
✅ **Amount validated on backend** (can't be manipulated)  
✅ **Payment verified server-side** (not trust frontend)  
✅ **Paystack webhook for double verification**  
✅ **Reference checked for uniqueness**

---

## 💳 Paystack Integration

### Frontend Implementation (`review.tsx`)

```tsx
import { Paystack, paystackProps } from 'react-native-paystack-webview';

const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
const [paymentData, setPaymentData] = useState(null);

// After processCheckout() succeeds
<Paystack
  paystackKey={PAYSTACK_PUBLIC_KEY}
  billingEmail={user.email}
  amount={paymentData.amount * 100}  // In kobo
  channels={['card', 'bank', 'ussd', 'mobile_money']}
  onSuccess={handlePaystackSuccess}
  onCancel={handlePaystackCancel}
  refNumber={paymentData.reference}
  ref={paystackWebViewRef}
/>
```

### Backend Implementation (`paystack.service.ts`)

```typescript
async initializePayment(data: PaystackPaymentData) {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: data.email,
      amount: data.amount * 100, // Convert to kobo
      reference: this.generateTransactionRef(),
      callback_url: 'closebuy://payment-callback', // Deep link
      channels: ['card', 'bank', 'ussd', 'mobile_money'],
      metadata: data.metadata,
    },
    {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    }
  );
  
  return response.data;
}

async verifyPayment(reference: string) {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    }
  );
  
  return response.data;
}
```

---

## 🧪 Testing the Flow

### 1. Test Data

**Test Card (Paystack)**
```
Card Number: 4084084084084081
Expiry: Any future date
CVV: 408
PIN: 0000
OTP: 123456
```

### 2. Step-by-Step Test

1. **Add items to cart**
   ```
   - Navigate to products
   - Click "Add to Cart" on multiple items
   - Go to Cart screen
   ```

2. **Enter shipping address**
   ```
   - Click "Proceed to Checkout"
   - Fill in delivery address
   - Click "Continue to Payment"
   ```

3. **Select payment method**
   ```
   - Select "Card"
   - Enter card details (or select saved)
   - Click "Review Order"
   ```

4. **Review & Place Order**
   ```
   - Verify all details
   - Click "Place Order"
   - Wait for order creation...
   - Paystack WebView opens
   ```

5. **Complete Payment**
   ```
   - Enter test card: 4084084084084081
   - Enter CVV: 408
   - Enter PIN: 0000
   - Enter OTP: 123456
   - Payment processes...
   ```

6. **Verify Success**
   ```
   - Backend verifies payment
   - Cart cleared automatically
   - Redirected to success screen
   - Order appears in Orders list
   ```

### 3. Test Error Scenarios

**Scenario 1: Payment Cancelled**
```
- Start payment flow
- Close Paystack WebView
- Should show: "Payment Cancelled" alert
- Order remains PENDING in backend
- Can retry from Orders page
```

**Scenario 2: Network Failure**
```
- Turn off internet during verification
- Should show: "Verification Failed" error
- Contact support message
- Order status: PENDING (manual verification needed)
```

**Scenario 3: Invalid Card**
```
- Use card: 5060666666666666666 (decline)
- Should show Paystack error
- Can retry with different card
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property 'email' of undefined"
**Cause:** User not authenticated  
**Solution:** Ensure user is logged in before checkout
```typescript
if (!user || !token) {
  Alert.alert('Please login to continue');
  router.push('/login');
  return;
}
```

### Issue 2: "Payment verification failed"
**Cause:** Backend didn't receive payment confirmation  
**Solution:** 
- Check backend logs
- Verify Paystack secret key is correct
- Ensure reference matches

### Issue 3: Paystack WebView not showing
**Cause:** Missing dependencies or incorrect key  
**Solution:**
```bash
npm install react-native-paystack-webview
npm install react-native-webview
```

### Issue 4: "Order already paid"
**Cause:** Duplicate verification attempt  
**Solution:** Check `paymentStatus` before verification:
```typescript
if (order.paymentStatus === PaymentStatus.SUCCESS) {
  // Already paid, navigate to success
  return;
}
```

---

## 📊 Order & Payment Status Flow

```
Order Status:
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    ↓
CANCELLED (if payment fails or user cancels)

Payment Status:
PENDING → SUCCESS
    ↓
FAILED (on error)
    ↓
REFUNDED (if refund requested)
```

---

## 🔗 API Endpoints Used

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get single order
- `PATCH /orders/:id/status` - Update order status
- `POST /orders/:id/cancel` - Cancel order

### Payment Endpoints
- `POST /payments/initialize` - Initialize payment
- `GET /payments/verify/:reference` - Verify payment
- `POST /payments/webhook` - Paystack webhook (backend only)
- `GET /payments/status/:orderId` - Check payment status
- `GET /payments/history` - Get payment history
- `POST /payments/refund` - Request refund

---

## 🚀 Deployment Checklist

### Frontend
- [ ] Update `EXPO_PUBLIC_API_URL` to production URL
- [ ] Use production Paystack public key
- [ ] Test complete flow on physical device
- [ ] Verify deep linking works
- [ ] Test on iOS and Android

### Backend
- [ ] Set production Paystack keys in `.env`
- [ ] Enable HTTPS (required by Paystack)
- [ ] Set up Paystack webhooks
- [ ] Configure CORS for mobile app
- [ ] Set up error logging (Sentry/LogRocket)
- [ ] Database backups enabled

---

## 📞 Support & Resources

- **Paystack Docs:** https://paystack.com/docs
- **Test Cards:** https://paystack.com/docs/payments/test-payments
- **Webhook Setup:** https://paystack.com/docs/payments/webhooks

---

## ✅ Complete Integration Checklist

### Frontend (CloseBuy)
- [x] Cart management (Redux)
- [x] Shipping address form
- [x] Payment method selection
- [x] Order review screen
- [x] Paystack WebView integration
- [x] Payment flow hook
- [x] Order service API calls
- [x] Secure payment service
- [x] Success screen
- [ ] Install `react-native-paystack-webview`
- [ ] Add environment variables
- [ ] Test complete flow

### Backend (HMB)
- [x] Order controller & service
- [x] Payment controller & service
- [x] Paystack service integration
- [x] DTOs for all endpoints
- [x] Webhook handler
- [x] Payment verification
- [x] Deep link callback URL
- [ ] Set up environment variables
- [ ] Configure Paystack webhook URL
- [ ] Test with Paystack test mode

---

## 🎉 You're Ready!

The complete Cart → Checkout → Order → Payment flow is now integrated! 

**Next Steps:**
1. Install dependencies: `npm install react-native-paystack-webview`
2. Set up environment variables
3. Run the app and test the flow
4. Deploy to production when ready

**Questions?** Check the inline comments in each file for detailed explanations.

