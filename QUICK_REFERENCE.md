# 🚀 CloseBuy Checkout Flow - Quick Reference

## 📋 Setup (One-Time)

```bash
# 1. Install dependencies
cd closebuy
npm install react-native-paystack-webview

# 2. Create .env file
cat > .env << EOF
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
EOF

# 3. Start backend
cd ../hmb
npm run start:dev

# 4. Start frontend
cd ../closebuy
npm start
```

---

## 🔄 User Flow

```
1. Cart (cart.tsx)
   └─> Add items → "Proceed to Checkout"

2. Shipping (shipping.tsx)
   └─> Enter address → "Continue to Payment"

3. Payment (payment.tsx)
   └─> Select method → "Review Order"

4. Review (review.tsx)
   └─> "Place Order" → Paystack WebView → Success!
```

---

## 🧑‍💻 Developer Flow

### When User Clicks "Place Order":

```typescript
// 1. usePaymentFlow hook
const { processCheckout, verifyPayment } = usePaymentFlow();

// 2. Create order + initialize payment
const result = await processCheckout();
// Returns: { reference, orderId, orderNumber }

// 3. Open Paystack WebView
<Paystack
  refNumber={result.reference}
  amount={total * 100}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>

// 4. On success → Verify payment
await verifyPayment(reference, orderId, orderNumber);
// → Backend verifies
// → Order status: CONFIRMED
// → Cart cleared
// → Navigate to success
```

---

## 🔐 Security Flow

```
Frontend                 Backend                  Paystack
────────                 ────────                 ────────
Create Order ──────────> ✓ Save order (PENDING)
                         ✓ Return orderId
                         
Init Payment ──────────> ✓ Call Paystack API ──> Initialize
                         ✓ Use SECRET_KEY         
                         <───────────────────── ✓ reference
                         ✓ Return reference        ✓ auth_url

User Pays ──────────────────────────────────────> ✓ Process

Verify ────────────────> ✓ Call Paystack API ──> Verify
                         ✓ Use SECRET_KEY
                         <───────────────────── ✓ Success
                         ✓ Update order           ✓ Amount
                         ✓ status: CONFIRMED      
                         <─────────────────────
                         ✓ Verified
```

---

## 📁 Key Files

```
closebuy/
├── hooks/usePaymentFlow.ts          # Main payment logic ⭐
├── app/(routes)/cart/review.tsx     # Paystack WebView ⭐
├── redux/slices/orderSlice.ts       # Order state
├── apiServices/orderService.ts      # API calls
└── apiServices/securePaymentService.ts  # Payment API

hmb/src/
├── payment/payment.service.ts       # Payment logic ⭐
├── payment/paystack.service.ts      # Paystack API ⭐
└── order/order.service.ts           # Order logic
```

---

## 🧪 Test Card

```
Card Number: 4084084084084081
Expiry: 12/30
CVV: 408
PIN: 0000
OTP: 123456
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "User undefined" | Ensure user is logged in |
| "Paystack not showing" | Run `npm install react-native-paystack-webview` |
| "Verification failed" | Check backend logs + Paystack keys |
| "Amount mismatch" | Backend validates amount |

---

## 📊 Order States

```
PENDING → User created order, payment not done
CONFIRMED → Payment successful, order confirmed
PROCESSING → Vendor processing order
SHIPPED → Rider assigned, en route
DELIVERED → Order completed
CANCELLED → Order cancelled
```

---

## 🎯 API Endpoints

```typescript
// Orders
POST   /orders                    // Create order
GET    /orders                    // Get user's orders
GET    /orders/:id                // Get single order
POST   /orders/:id/cancel         // Cancel order

// Payments
POST   /payments/initialize       // Initialize payment
GET    /payments/verify/:ref      // Verify payment ⭐
POST   /payments/webhook          // Paystack webhook
GET    /payments/status/:orderId  // Check status
```

---

## ✅ Checklist

### Before Testing
- [ ] Backend running on port 3000
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] User logged in

### During Testing
- [ ] Cart has items
- [ ] Shipping address entered
- [ ] Payment method selected
- [ ] Order review correct
- [ ] Payment completes
- [ ] Cart clears
- [ ] Success screen shows

---

## 📞 Need Help?

1. **Full Guide:** `CHECKOUT_INTEGRATION_GUIDE.md`
2. **Summary:** `INTEGRATION_SUMMARY.md`
3. **Paystack Docs:** https://paystack.com/docs

---

## 🎉 Quick Commands

```bash
# Setup
./setup-payment.sh   # or .ps1 on Windows

# Start backend
cd hmb && npm run start:dev

# Start frontend
cd closebuy && npm start

# Install Paystack
npm install react-native-paystack-webview

# Check backend logs
# Look for: "Payment initialized", "Payment verified"
```

---

**Status:** ✅ COMPLETE & READY TO USE

Happy coding! 🚀

