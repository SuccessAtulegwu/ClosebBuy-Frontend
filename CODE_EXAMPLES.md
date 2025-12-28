# Code Usage Examples

Quick reference for using the order system components and Redux state.

## 🛒 Cart Management

### Adding Items to Cart
```typescript
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cartSlice';

function ProductComponent() {
  const dispatch = useAppDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      inStock: product.inStock,
      category: product.category,
    }));
  };

  return (
    <TouchableOpacity onPress={() => handleAddToCart(product)}>
      <Text>Add to Cart</Text>
    </TouchableOpacity>
  );
}
```

### Getting Cart Data
```typescript
import { useAppSelector } from '@/redux/hooks';

function CartBadge() {
  const totalItems = useAppSelector(state => state.cart.totalItems);
  const totalAmount = useAppSelector(state => state.cart.totalAmount);
  const items = useAppSelector(state => state.cart.items);

  return (
    <View>
      <Text>Items: {totalItems}</Text>
      <Text>Total: ₦{totalAmount.toLocaleString()}</Text>
    </View>
  );
}
```

### Updating Quantities
```typescript
import { useAppDispatch } from '@/redux/hooks';
import { incrementQuantity, decrementQuantity, updateQuantity } from '@/redux/slices/cartSlice';

function CartItemControls({ productId, currentQuantity }) {
  const dispatch = useAppDispatch();

  return (
    <View>
      <Button onPress={() => dispatch(decrementQuantity(productId))}>-</Button>
      <Text>{currentQuantity}</Text>
      <Button onPress={() => dispatch(incrementQuantity(productId))}>+</Button>
      
      {/* Or set specific quantity */}
      <Button onPress={() => dispatch(updateQuantity({ id: productId, quantity: 5 }))}>
        Set to 5
      </Button>
    </View>
  );
}
```

### Removing Items
```typescript
import { removeFromCart, clearCart } from '@/redux/slices/cartSlice';

// Remove single item
dispatch(removeFromCart(productId));

// Clear entire cart
dispatch(clearCart());
```

---

## 📍 Shipping Address

### Setting Address
```typescript
import { setShippingAddress, addSavedAddress } from '@/redux/slices/orderSlice';

function ShippingForm() {
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    isDefault: false,
  });

  const handleSubmit = () => {
    // Set as current shipping address
    dispatch(setShippingAddress(address));
    
    // Optionally save for future
    if (address.isDefault) {
      dispatch(addSavedAddress(address));
    }
  };

  return (
    <Button onPress={handleSubmit}>Save Address</Button>
  );
}
```

### Getting Saved Addresses
```typescript
import { useAppSelector } from '@/redux/hooks';

function SavedAddressesList() {
  const savedAddresses = useAppSelector(state => state.order.savedAddresses);
  const currentAddress = useAppSelector(state => state.order.shippingAddress);

  return (
    <FlatList
      data={savedAddresses}
      renderItem={({ item }) => (
        <AddressCard 
          address={item}
          isSelected={item.address === currentAddress?.address}
        />
      )}
    />
  );
}
```

---

## 💳 Payment Methods

### Setting Payment Method
```typescript
import { setPaymentMethod, addSavedPaymentMethod } from '@/redux/slices/orderSlice';

function PaymentForm() {
  const dispatch = useAppDispatch();

  const handleCardPayment = (cardDetails) => {
    const payment = {
      id: Date.now().toString(),
      type: 'card',
      cardNumber: cardDetails.cardNumber,
      cardHolderName: cardDetails.cardHolderName,
      expiryDate: cardDetails.expiryDate,
      cvv: cardDetails.cvv,
      isDefault: false,
    };

    dispatch(setPaymentMethod(payment));
    
    // Optionally save
    if (saveCard) {
      dispatch(addSavedPaymentMethod(payment));
    }
  };

  return (
    <Button onPress={handleCardPayment}>Pay with Card</Button>
  );
}
```

### Cash on Delivery
```typescript
const handleCashPayment = () => {
  dispatch(setPaymentMethod({
    id: Date.now().toString(),
    type: 'cash',
  }));
};
```

---

## 📦 Order Placement

### Place Order with Full Flow
```typescript
import { placeOrder } from '@/redux/slices/orderSlice';
import { clearCart } from '@/redux/slices/cartSlice';

function ReviewOrderScreen() {
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector(state => state.cart);
  const { shippingAddress, paymentMethod, deliveryFee, tax } = useAppSelector(state => state.order);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items,
        shippingAddress,
        paymentMethod,
        subtotal: totalAmount,
        deliveryFee,
        tax,
        total: totalAmount + deliveryFee + tax,
      };

      const result = await dispatch(placeOrder(orderData)).unwrap();
      
      // Success!
      dispatch(clearCart());
      router.push({
        pathname: '/(routes)/cart/success',
        params: { 
          orderId: result.id, 
          orderNumber: result.orderNumber 
        },
      });
    } catch (error) {
      Alert.alert('Order Failed', error);
    }
  };

  return (
    <Button onPress={handlePlaceOrder}>Place Order</Button>
  );
}
```

### Get Order History
```typescript
import { fetchOrders } from '@/redux/slices/orderSlice';

function OrdersScreen() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.order.orders);
  const loading = useAppSelector(state => state.order.loading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}
```

---

## 🔌 Backend Integration

### Connect Order API
```typescript
// In redux/slices/orderSlice.ts

import { OrderService } from '@/apiServices/orderService';

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // Use real API instead of mock
      const response = await OrderService.createOrder(orderData);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Use API Services Directly
```typescript
import { OrderService, PaymentService } from '@/apiServices/orderService';

// Get order details
const getOrderDetails = async (orderId: string) => {
  const result = await OrderService.getOrderById(orderId);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
};

// Initialize payment
const startPayment = async (orderId: string, amount: number) => {
  const result = await PaymentService.initializePayment({
    orderId,
    amount,
    paymentMethod: { /* ... */ },
  });
  
  if (result.success) {
    // Redirect to payment URL
    const { authorizationUrl } = result.data;
    Linking.openURL(authorizationUrl);
  }
};
```

---

## 🧭 Navigation

### Navigate to Cart
```typescript
import { useRouter } from 'expo-router';

function HeaderCartButton() {
  const router = useRouter();
  
  return (
    <TouchableOpacity onPress={() => router.push('/(routes)/cart/cart')}>
      <Icon name="cart" />
    </TouchableOpacity>
  );
}
```

### Navigate Through Checkout
```typescript
// From Cart to Shipping
router.push('/(routes)/cart/shipping');

// From Shipping to Payment
router.push('/(routes)/cart/payment');

// From Payment to Review
router.push('/(routes)/cart/review');

// From Review to Success (with params)
router.replace({
  pathname: '/(routes)/cart/success',
  params: { orderId: '123', orderNumber: 'ORD-456' },
});
```

---

## 🎨 Theming

### Use Theme in Components
```typescript
import { ThemeContext } from '@/context/ThemeContext';

function MyComponent() {
  const { theme } = useContext(ThemeContext);
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text,
    },
    button: {
      backgroundColor: theme.accent,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}
```

---

## 🔔 Cart Badge Component

### Complete Example
```typescript
import { useAppSelector } from '@/redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function CartBadge() {
  const cartItemsCount = useAppSelector(state => state.cart.totalItems);
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={() => router.push('/(routes)/cart/cart')}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons 
          name="cart-outline" 
          size={24} 
          color={theme.text} 
        />
        {cartItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cartItemsCount > 9 ? '9+' : cartItemsCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
```

---

## 🎭 Loading States

### Handling Async Operations
```typescript
function OrdersComponent() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Button onPress={() => dispatch(fetchOrders())}>Retry</Button>
      </View>
    );
  }

  return <OrdersList orders={orders} />;
}
```

---

## 🔧 Custom Hooks

### Create Reusable Cart Hook
```typescript
// hooks/useCart.ts
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart, removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';

export function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);

  const add = (product) => dispatch(addToCart(product));
  const remove = (productId) => dispatch(removeFromCart(productId));
  const update = (productId, quantity) => dispatch(updateQuantity({ id: productId, quantity }));

  return {
    items: cart.items,
    total: cart.totalAmount,
    count: cart.totalItems,
    add,
    remove,
    update,
  };
}

// Usage
function ProductCard({ product }) {
  const cart = useCart();
  
  return (
    <Button onPress={() => cart.add(product)}>
      Add to Cart ({cart.count})
    </Button>
  );
}
```

---

## 📊 Calculate Totals

### Custom Calculations
```typescript
import { calculateTax, setDeliveryFee } from '@/redux/slices/orderSlice';

function OrderSummary() {
  const dispatch = useAppDispatch();
  const { totalAmount } = useAppSelector(state => state.cart);
  const { deliveryFee, tax } = useAppSelector(state => state.order);

  // Calculate tax (7.5%)
  useEffect(() => {
    dispatch(calculateTax(totalAmount));
  }, [totalAmount]);

  // Calculate delivery based on location
  const updateDelivery = (location) => {
    const fee = location.state === 'Lagos' ? 500 : 1000;
    dispatch(setDeliveryFee(fee));
  };

  const grandTotal = totalAmount + deliveryFee + tax;

  return (
    <View>
      <Text>Subtotal: ₦{totalAmount.toLocaleString()}</Text>
      <Text>Delivery: ₦{deliveryFee.toLocaleString()}</Text>
      <Text>Tax: ₦{tax.toFixed(2)}</Text>
      <Text>Total: ₦{grandTotal.toLocaleString()}</Text>
    </View>
  );
}
```

---

## 💾 Persisting State (Optional)

### Add Redux Persist
```typescript
// Install: npm install redux-persist

import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'order'], // Persist cart and order
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
```

---

These examples cover the most common use cases! Refer to the actual implementation files for more details. 🎯

