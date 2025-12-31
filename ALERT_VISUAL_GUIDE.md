# Custom Alert System - Visual Guide

## Alert Types

### 1. Success Alert ✅
```
┌─────────────────────────────────┐
│                                 │
│        ╭───────────╮            │
│        │     ✓     │            │ <- Green circle icon
│        ╰───────────╯            │
│                                 │
│         Success!                │ <- Bold title
│                                 │
│  Your order has been placed     │ <- Message text
│      successfully.              │
│                                 │
│  ┌───────────────────────────┐ │
│  │          OK               │ │ <- Green button
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Use Cases:**
- Account creation
- Order confirmation
- Profile updates
- Payment success
- Item added to cart

---

### 2. Error Alert ❌
```
┌─────────────────────────────────┐
│                                 │
│        ╭───────────╮            │
│        │     ✕     │            │ <- Red circle icon
│        ╰───────────╯            │
│                                 │
│       Login Failed              │ <- Bold title
│                                 │
│   Invalid email or password.    │ <- Formatted error
│     Please try again.           │
│                                 │
│  ┌───────────────────────────┐ │
│  │          OK               │ │ <- Green button
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Use Cases:**
- Login failures
- API errors
- Validation errors
- Network errors
- Firebase auth errors

---

### 3. Warning Alert ⚠️
```
┌─────────────────────────────────┐
│                                 │
│        ╭───────────╮            │
│        │     ⚠     │            │ <- Orange triangle icon
│        ╰───────────╯            │
│                                 │
│       Low Stock                 │ <- Bold title
│                                 │
│  Only 2 items left in stock.    │ <- Warning message
│      Order soon!                │
│                                 │
│  ┌───────────────────────────┐ │
│  │          OK               │ │ <- Green button
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Use Cases:**
- Low stock warnings
- Unsaved changes
- Account warnings
- Permission requests
- Data loss warnings

---

### 4. Info Alert ℹ️
```
┌─────────────────────────────────┐
│                                 │
│        ╭───────────╮            │
│        │     ℹ     │            │ <- Blue circle icon
│        ╰───────────╯            │
│                                 │
│     Delivery Update             │ <- Bold title
│                                 │
│  Your order will be delivered   │ <- Info message
│    between 2-4 PM today.        │
│                                 │
│  ┌───────────────────────────┐ │
│  │          OK               │ │ <- Green button
│  └───────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Use Cases:**
- Delivery updates
- Feature announcements
- Tips and hints
- Status updates
- General information

---

## Button Configurations

### Single Default Button
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐ │
│  │          OK               │ │ <- Green filled button
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

### Two Buttons (Cancel + Confirm)
```
┌─────────────────────────────────┐
│  ┌──────────┐  ┌──────────────┐ │
│  │ Cancel   │  │   Confirm    │ │
│  └──────────┘  └──────────────┘ │
│   ^ Outlined    ^ Green filled   │
└─────────────────────────────────┘
```

### Two Buttons (Cancel + Destructive)
```
┌─────────────────────────────────┐
│  ┌──────────┐  ┌──────────────┐ │
│  │ Cancel   │  │   Delete     │ │
│  └──────────┘  └──────────────┘ │
│   ^ Outlined    ^ Red filled     │
└─────────────────────────────────┘
```

---

## Real Examples from Your App

### Signup Success
```typescript
alertService.success(
  'Success',
  'Account created successfully! Please login to continue.',
  [
    {
      text: 'Login',
      style: 'default',
      onPress: () => router.replace('/(auth)/login'),
    },
  ]
);
```

**Result:**
```
┌─────────────────────────────────┐
│        ╭───────────╮            │
│        │     ✓     │            │
│        ╰───────────╯            │
│                                 │
│         Success                 │
│                                 │
│  Account created successfully!  │
│  Please login to continue.      │
│                                 │
│  ┌───────────────────────────┐ │
│  │         Login             │ │ <- Click navigates to login
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

### Login Error (Firebase)
```typescript
// Firebase error: auth/wrong-password
alertService.error('Login Failed', error);
```

**Result:**
```
┌─────────────────────────────────┐
│        ╭───────────╮            │
│        │     ✕     │            │
│        ╰───────────╯            │
│                                 │
│       Login Failed              │
│                                 │
│   Incorrect password.           │
│     Please try again.           │
│                                 │
│  ┌───────────────────────────┐ │
│  │          OK               │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

### Delete Confirmation
```typescript
alertService.confirm(
  'Delete Item',
  'Are you sure you want to remove this item from your cart?',
  () => deleteItem(),
  () => console.log('Cancelled'),
  'Remove',
  'Cancel'
);
```

**Result:**
```
┌─────────────────────────────────┐
│        ╭───────────╮            │
│        │     ⚠     │            │
│        ╰───────────╯            │
│                                 │
│       Delete Item               │
│                                 │
│  Are you sure you want to       │
│  remove this item from your     │
│         cart?                   │
│                                 │
│  ┌──────────┐  ┌──────────────┐│
│  │ Cancel   │  │   Remove     ││
│  └──────────┘  └──────────────┘│
└─────────────────────────────────┘
```

---

## Theme Integration

The alerts automatically adapt to your app's theme:

### Light Mode
- Background: White/Light grey
- Text: Dark grey/Black
- Icons: Colored (Green/Red/Orange/Blue)
- Buttons: Theme accent color

### Dark Mode
- Background: Dark grey/Black
- Text: White/Light grey
- Icons: Colored (Green/Red/Orange/Blue)
- Buttons: Theme accent color

---

## Animation

1. **Entrance**: Fade in with backdrop
2. **Icon**: Slight scale animation on appear
3. **Exit**: Fade out smoothly
4. **Backdrop**: Click to dismiss (optional)

---

## Accessibility

✅ Large touch targets (48x48 minimum)
✅ Clear, readable text (16px body, 22px title)
✅ High contrast icons and text
✅ Semantic button colors
✅ Clear visual hierarchy
✅ Support for dark mode

---

## Best Practices

### DO ✅
- Use success for positive confirmations
- Use error for failures with formatted messages
- Use warning for cautionary actions
- Use info for neutral information
- Provide clear, actionable button text
- Keep messages concise (2-3 lines max)

### DON'T ❌
- Don't use generic "Error" messages
- Don't show multiple alerts at once
- Don't use alerts for non-important info
- Don't make buttons ambiguous
- Don't write overly technical messages
- Don't nest alerts

---

## Error Message Transformations

### Before (Technical)
```
Error: auth/email-already-in-use
```

### After (User-Friendly)
```
This email is already registered.
Please login or use a different email.
```

---

### Before (Backend)
```json
{
  "response": {
    "data": {
      "errors": [
        "email_required",
        "password_min_length_6"
      ]
    }
  }
}
```

### After (User-Friendly)
```
email_required
password_min_length_6
```
(Each on a new line)

---

## Summary

The custom alert system provides:
- 🎨 Beautiful, theme-aware UI
- 🔄 Automatic error formatting
- 🎯 Multiple alert types
- 🔥 Firebase error handling
- 📱 Mobile-optimized design
- ♿ Accessible components
- 💪 Easy to use API

**One import, endless possibilities:**
```typescript
import { alertService } from '@/utils/alertService';
```

