# Quick Start Guide - Order System Integration

## 🚀 How to Use the Order System

### For Users (App Flow)

1. **Browse Products** on Home Screen
2. **Add to Cart** by clicking "Add to cart" button on products
3. **View Cart** by clicking cart icon in header (shows item count)
4. **Update Quantities** using +/- buttons or remove items
5. **Proceed to Checkout** 
6. **Enter Shipping Address** (or select saved address)
7. **Select Payment Method** (Card/Bank Transfer/Wallet/Cash)
8. **Review Order** with full summary
9. **Place Order** and see success screen
10. **Track Order** or continue shopping

### For Developers (Integration)

#### Step 1: Configure API
```typescript
// Add to .env or app.json
EXPO_PUBLIC_API_URL=https://your-api-url.com/v1
```

#### Step 2: Update Order Slice to Use Real API
```typescript
// redux/slices/orderSlice.ts
import { OrderService } from '@/apiServices/orderService';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // Replace mock with real API call
      const response = await OrderService.createOrder(orderData);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);
```

#### Step 3: Add Authentication Token
```typescript
// apiServices/orderService.ts
// Update the apiCall function to include auth token

async function apiCall<T>(endpoint: string, options: RequestInit = {}) {
  // Get token from your auth state/storage
  const token = await getAuthToken(); // Implement this function
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  // ... rest of the function
}
```

#### Step 4: Test the Integration
```typescript
// Test in your component
import { OrderService } from '@/apiServices/orderService';

const testOrder = async () => {
  const result = await OrderService.createOrder({
    items: [...],
    shippingAddress: {...},
    // ... other data
  });
  
  console.log('Order result:', result);
};
```

## 🎨 Customization

### Change Theme Colors
```typescript
// Update your ThemeContext colors
const theme = {
  accent: '#YOUR_PRIMARY_COLOR',
  secondary: '#YOUR_SECONDARY_COLOR',
  // ... other colors
};
```

### Modify Delivery Fee
```typescript
// redux/slices/orderSlice.ts
const initialState = {
  deliveryFee: 500, // Change default here
  // ...
};

// Or update dynamically based on location
dispatch(setDeliveryFee(calculatedFee));
```

### Change Tax Rate
```typescript
// redux/slices/orderSlice.ts - calculateTax reducer
calculateTax: (state, action: PayloadAction<number>) => {
  // Change 0.075 (7.5%) to your tax rate
  state.tax = action.payload * 0.075;
},
```

## 📱 Screen Customization

### Cart Screen
Location: `app/(routes)/cart/cart.tsx`
- Customize empty cart message
- Modify item card design
- Change checkout button style

### Shipping Screen
Location: `app/(routes)/cart/shipping.tsx`
- Add/remove address fields
- Customize validation rules
- Modify saved addresses display

### Payment Screen
Location: `app/(routes)/cart/payment.tsx`
- Add/remove payment methods
- Integrate payment gateway
- Customize card form

### Success Screen
Location: `app/(routes)/cart/success.tsx`
- Customize animations
- Modify success message
- Change action buttons

## 🔌 API Endpoints Required

Your backend needs these endpoints (see API_DOCUMENTATION.md for details):

### Essential
- `POST /orders` - Create order
- `GET /orders` - Get orders list
- `GET /orders/:id` - Get order details

### Optional but Recommended
- `POST /cart/shipping-fee` - Calculate delivery fee
- `POST /payments/initialize` - Initialize payment
- `GET /payments/verify/:reference` - Verify payment
- `POST /addresses` - Save address
- `POST /payments/methods` - Save payment method

## 🧪 Testing Checklist

- [ ] Add products to cart
- [ ] Update quantities in cart
- [ ] Remove items from cart
- [ ] Cart badge shows correct count
- [ ] Navigate through checkout flow
- [ ] Fill shipping address form
- [ ] Validate address fields
- [ ] Select payment method
- [ ] Review order details
- [ ] Place order successfully
- [ ] See success screen
- [ ] Navigate to orders
- [ ] Test with empty cart

## 🐛 Common Issues

### Issue: Cart not updating
**Solution:** Check Redux Provider is wrapping the app in `_layout.tsx`

### Issue: Navigation not working
**Solution:** Verify route names match in `_layout.tsx`

### Issue: API calls failing
**Solution:** Check `EXPO_PUBLIC_API_URL` is set correctly

### Issue: Styles look broken
**Solution:** Ensure ThemeContext is properly configured

## 💡 Tips

1. **Use Redux DevTools** for debugging state
2. **Test with sample data** before connecting backend
3. **Validate forms** on both frontend and backend
4. **Handle loading states** for better UX
5. **Show error messages** clearly to users
6. **Save user preferences** (addresses, payment methods)
7. **Add analytics** to track conversion funnel

## 🔄 Future Enhancements

- [ ] Add promo codes/coupons
- [ ] Implement wish list
- [ ] Add product reviews
- [ ] Enable social sharing
- [ ] Add order notifications
- [ ] Implement real-time tracking
- [ ] Add chat support
- [ ] Enable multiple currency support
- [ ] Add order scheduling
- [ ] Implement loyalty points

## 📞 Support

For issues or questions about implementation:
1. Check API_DOCUMENTATION.md for endpoint details
2. Review ORDER_SYSTEM_README.md for feature overview
3. Examine Redux slice files for state management
4. Review component files for UI implementation

## ✨ Quick Commands

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Check for issues
npm run lint
```

---

**Ready to go! Start testing with sample data, then connect your backend.** 🎉

