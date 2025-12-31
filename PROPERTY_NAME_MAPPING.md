# 🔧 Property Name Mapping - Important!

## ⚠️ Key Differences Between Frontend UI and Backend DTOs

### Shipping Address Field Mapping

When collecting data from users in the UI (shipping forms), you may use different property names for better UX. However, when sending to the backend, use the correct DTO property names:

| UI Field Name (Forms) | Backend DTO Property | Type |
|----------------------|---------------------|------|
| `fullName` | `name` | string |
| `zipCode` | `postalCode` | string |
| `phoneNumber` | `phoneNumber` | string ✅ (same) |
| `address` | `address` | string ✅ (same) |
| `city` | `city` | string ✅ (same) |
| `state` | `state` | string ✅ (same) |
| `landmark` | `landmark` | string ✅ (same) |

### User Field Mapping

| Frontend Reference | Backend User Type |
|-------------------|------------------|
| `user.displayName` | `user.name` |
| `user.phoneNumber` | ❌ Not available (use shipping address phone) |

---

## 📝 Updated ShippingAddress Type

The `ShippingAddress` interface extends `DeliveryDetail`:

```typescript
export interface DeliveryDetail {
  id: number
  userId: number
  user: User
  address: string
  city: string
  name: string          // ← Use this, not "fullName"
  state: string
  postalCode: string    // ← Use this, not "zipCode"
  phoneNumber: string
  landmark: string
  orders: Order[]
}

export interface ShippingAddress extends Omit<DeliveryDetail, 'id' | 'userId' | 'user' | 'orders'> {
  isDefault?: boolean;
}
```

---

## 🔄 Correct CreateDeliveryDetailDto

```typescript
export interface CreateDeliveryDetailDto {
  userId: number;
  address: string;
  city: string;
  state: string;
  postalCode?: string;    // ← NOT "zipCode"
  phoneNumber: string;
  landmark?: string;
  name?: string;          // ← NOT "fullName"
}
```

---

## ✅ Fixed in usePaymentFlow.ts

The hook now correctly maps the properties:

```typescript
const deliveryDetails: CreateDeliveryDetailDto = {
  userId: user.id,
  address: shippingAddress.address,
  city: shippingAddress.city,
  state: shippingAddress.state,
  postalCode: shippingAddress.postalCode,  // ✅ Correct
  phoneNumber: shippingAddress.phoneNumber,
  landmark: shippingAddress.landmark,
  name: shippingAddress.name,              // ✅ Correct
};
```

---

## 🛠️ If You Need to Update UI Forms

If your shipping forms use `fullName` and `zipCode` (common in UI), you'll need to update them to use the correct property names:

### Option 1: Update the Form Fields (Recommended)

Change the shipping form to use `name` and `postalCode`:

```typescript
// In shipping.tsx
const [formData, setFormData] = useState({
  name: '',           // ← Changed from fullName
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',     // ← Changed from zipCode
  landmark: '',
});
```

### Option 2: Map on Submit (If changing forms is not feasible)

If you must keep UI with `fullName` and `zipCode` for UX reasons, map them before Redux:

```typescript
// In shipping.tsx handleContinue
dispatch(setShippingAddress({
  ...formData,
  name: formData.fullName,        // Map fullName → name
  postalCode: formData.zipCode,   // Map zipCode → postalCode
}));
```

---

## 🎯 Summary

**Always use these property names when working with backend DTOs:**
- ✅ `name` (not `fullName`)
- ✅ `postalCode` (not `zipCode`)
- ✅ `user.name` (not `user.displayName`)
- ✅ Use `shippingAddress.phoneNumber` (user doesn't have phone)

**Status:** ✅ All fixes applied to `usePaymentFlow.ts`

