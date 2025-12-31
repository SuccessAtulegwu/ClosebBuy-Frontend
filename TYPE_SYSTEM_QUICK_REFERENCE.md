# Quick Type System Reference

This is a quick reference guide for using the centralized type system in the CloseBuy app.

## 📦 Import Cheat Sheet

```typescript
// Types (Domain Entities)
import { 
  User, 
  Order, 
  OrderItem,
  Product, 
  Vendor,
  DeliveryDetail,
  Payment,
  Notification,
  Message,
  Estate,
  ProductCategory,
  ProductImage
} from '@/types/publicTypes';

// Enums (Status & Types)
import {
  Role,                    // User roles
  OrderStatus,            // Order states
  PaymentStatus,          // Payment states
  PaymentMethod,          // Payment types
  VendorStatus,           // Vendor states
  NotificationType,       // Notification types
  TransactionStatus,      // Transaction states
  WithdrawalStatus        // Withdrawal states
} from '@/types/publicenums';

// DTOs (API Payloads)
import {
  CreateOrderDto,
  CreateDeliveryDetailDto,
  CreateUserDto,
  OrderItemDto
} from '@/types/publicDTOTypes';
```

---

## 🎯 Common Use Cases

### 1. Redux State Access

```typescript
import { useAppSelector, useAppDispatch } from '@/redux/hooks';

// Get user from auth state
const user = useAppSelector((state) => state.auth.user); // User | null
const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated); // boolean

// Get cart items
const cartItems = useAppSelector((state) => state.cart.items); // CartItem[]
const totalAmount = useAppSelector((state) => state.cart.totalAmount); // number

// Get orders
const orders = useAppSelector((state) => state.order.orders); // OrderListItem[]
const currentOrder = useAppSelector((state) => state.order.currentOrder); // Partial<OrderListItem> | null
```

### 2. Redux Actions

```typescript
import { useAppDispatch } from '@/redux/hooks';
import { loginUser, setUser } from '@/redux/slices/authSlice';
import { addToCart, clearCart } from '@/redux/slices/cartSlice';
import { placeOrder, setShippingAddress } from '@/redux/slices/orderSlice';

const dispatch = useAppDispatch();

// Auth actions
dispatch(loginUser({ email: 'user@email.com', password: 'pass123' }));
dispatch(setUser(userData));

// Cart actions
dispatch(addToCart({
  id: 1,
  productId: 1,
  name: 'Product Name',
  price: 1000,
  image: 'url',
  inStock: true,
  vendorId: 1
}));

// Order actions
dispatch(setShippingAddress(addressData));
dispatch(placeOrder(orderDto));
```

### 3. API Service Calls

```typescript
import { OrderService, ProductService, AddressService } from '@/apiServices/orderService';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@/types/publicenums';

// Create an order
const orderData: CreateOrderDto = {
  customerId: 1,
  total: 1000,
  subtotal: 900,
  deliveryFee: 100,
  tax: 0,
  currency: 'NGN',
  paymentMethod: PaymentMethod.CARD,
  status: OrderStatus.PENDING,
  paymentStatus: PaymentStatus.PENDING,
  items: orderItems,
  orderNumber: `ORD-${Date.now()}`,
  deliveryDetails: addressData
};

const response = await OrderService.createOrder(orderData);
if (response.success && response.data) {
  console.log('Order created:', response.data);
}

// Get products
const productsResponse = await ProductService.getProducts({
  category: 'fruits',
  search: 'apple',
  page: 1,
  limit: 20
});

// Get addresses
const addressesResponse = await AddressService.getAddresses();
```

### 4. Component Props

```typescript
import { Product, Order } from '@/types/publicTypes';

// Product component
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onPress: (id: number) => void;
}

export function ProductCard({ product, onAddToCart, onPress }: ProductCardProps) {
  // Component implementation
}

// Order component
interface OrderItemProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
}

export function OrderItem({ order, onViewDetails }: OrderItemProps) {
  // Component implementation
}
```

### 5. Form Data with DTOs

```typescript
import { CreateDeliveryDetailDto } from '@/types/publicDTOTypes';

const handleSaveAddress = async () => {
  const addressData: CreateDeliveryDetailDto = {
    userId: currentUser.id,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postalCode: formData.postalCode,
    phoneNumber: formData.phoneNumber,
    landmark: formData.landmark,
    name: formData.name,
  };

  const response = await AddressService.addAddress(addressData);
  // Handle response
};
```

---

## 🔍 Type Checking Patterns

### Optional Chaining
```typescript
const userName = user?.name ?? 'Guest';
const firstOrderDate = orders[0]?.createdAt;
const deliveryAddress = order?.delivery?.address;
```

### Type Guards
```typescript
import { User } from '@/types/publicTypes';

function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.email === 'string';
}

// Usage
if (isUser(data)) {
  console.log(data.email); // TypeScript knows it's a User
}
```

### Partial Types
```typescript
import { User } from '@/types/publicTypes';

// For updates where not all fields are required
const updateUserProfile = (userId: number, updates: Partial<User>) => {
  // Implementation
};

// Usage
updateUserProfile(1, { name: 'New Name' }); // Only name is required
```

---

## 🎨 Enum Usage

```typescript
import { OrderStatus, PaymentMethod, Role } from '@/types/publicenums';

// Use enum values instead of strings
const orderStatus: OrderStatus = OrderStatus.PENDING;
const paymentMethod: PaymentMethod = PaymentMethod.CARD;
const userRole: Role = Role.RESIDENT;

// Switch statements
switch (order.status) {
  case OrderStatus.PENDING:
    return 'Order is pending';
  case OrderStatus.CONFIRMED:
    return 'Order confirmed';
  case OrderStatus.SHIPPED:
    return 'Order shipped';
  case OrderStatus.DELIVERED:
    return 'Order delivered';
  default:
    return 'Unknown status';
}

// Conditional rendering
{order.paymentStatus === PaymentStatus.SUCCESS && (
  <View>
    <Text>Payment Successful</Text>
  </View>
)}
```

---

## 🛠️ Utility Types

### Pick - Select specific fields
```typescript
import { User } from '@/types/publicTypes';

type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

const profile: UserProfile = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
```

### Omit - Exclude specific fields
```typescript
import { Order } from '@/types/publicTypes';

type OrderPreview = Omit<Order, 'items' | 'payment' | 'delivery'>;

const preview: OrderPreview = {
  id: 1,
  customerId: 1,
  total: 1000,
  // ... other fields except items, payment, delivery
};
```

### Extend interfaces
```typescript
import { DeliveryDetail, Notification as NotificationBase } from '@/types/publicTypes';

interface ExtendedAddress extends DeliveryDetail {
  isDefault: boolean;
  nickname: string;
}

const address: ExtendedAddress = {
  // ... all DeliveryDetail fields
  isDefault: true,
  nickname: 'Home',
};

// When extending types that may conflict with global types
// Use Omit to remove fields you want to replace
interface UINotification extends Omit<NotificationBase, 'user' | 'userId' | 'createdAt'> {
  timestamp: Date;  // Replacing createdAt with timestamp for UI
  actionData?: any; // Adding UI-specific field
}
```

---

## 📋 Common Patterns

### Loading States
```typescript
interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const [orderState, setOrderState] = useState<LoadingState<Order>>({
  data: null,
  loading: false,
  error: null,
});
```

### API Response Handling
```typescript
const fetchOrder = async (orderId: string) => {
  setOrderState({ data: null, loading: true, error: null });
  
  const response = await OrderService.getOrderById(orderId);
  
  if (response.success && response.data) {
    setOrderState({ data: response.data, loading: false, error: null });
  } else {
    setOrderState({ data: null, loading: false, error: response.error || 'Failed to fetch' });
  }
};
```

### Array Operations
```typescript
import { Product } from '@/types/publicTypes';

const products: Product[] = await getProducts();

// Filter
const inStockProducts = products.filter(p => p.stock > 0);

// Map
const productNames = products.map(p => p.title);

// Find
const product = products.find(p => p.id === 1);

// Sort
const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't use `any`
```typescript
// Bad
const user: any = await getUser();

// Good
const user: User | null = await getUser();
```

### ❌ Don't use string literals for enums
```typescript
// Bad
const status = 'pending';

// Good
const status = OrderStatus.PENDING;
```

### ❌ Don't ignore optional chaining
```typescript
// Bad (can throw error)
const name = user.name;

// Good
const name = user?.name ?? 'Guest';
```

### ❌ Don't create duplicate interfaces
```typescript
// Bad
interface MyUser {
  id: number;
  email: string;
  name: string;
}

// Good - Import existing type
import { User } from '@/types/publicTypes';
```

---

## 📚 Further Reading

- See `TYPE_SYSTEM_UPDATE.md` for comprehensive documentation
- See `types/publicTypes.ts` for all entity definitions
- See `types/publicenums.ts` for all enum definitions
- See `types/publicDTOTypes.ts` for API payload definitions
- See Redux slices for state management patterns

---

**Quick Tip**: Use TypeScript's IntelliSense (Ctrl+Space) in your IDE to explore available types and their properties!

