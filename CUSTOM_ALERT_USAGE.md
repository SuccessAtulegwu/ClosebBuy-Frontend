# Custom Alert System - Usage Guide

## Overview

The custom alert system provides a beautiful, user-friendly way to display notifications, errors, warnings, and success messages throughout the app. It automatically formats backend error messages and Firebase errors into user-readable text.

## Features

- ✨ Beautiful UI with icon animations
- 🎨 Theme-aware (automatically adapts to app theme)
- 🔄 Automatic error message formatting
- 🔥 Firebase error handling
- 🌐 Backend error message formatting
- 📱 Multiple alert types (success, error, warning, info)
- 🎯 Customizable buttons and actions

## Setup

The alert system is already integrated into your app via `AlertProvider` in `app/_layout.tsx`.

## Basic Usage

Import the alert service in any component:

```typescript
import { alertService } from '@/utils/alertService';
```

### Success Alert

```typescript
alertService.success(
  'Success',
  'Your account has been created successfully!'
);
```

### Error Alert

The error alert automatically formats error messages from:
- Backend API responses
- Firebase authentication errors
- Network errors
- Custom error objects

```typescript
try {
  await someApiCall();
} catch (error) {
  alertService.error('Operation Failed', error);
}
```

### Warning Alert

```typescript
alertService.warning(
  'Warning',
  'This action cannot be undone. Are you sure?'
);
```

### Info Alert

```typescript
alertService.info(
  'Information',
  'Your order will be delivered in 2-3 business days.'
);
```

## Advanced Usage

### Custom Buttons

```typescript
alertService.success(
  'Account Created',
  'Your account has been created successfully!',
  [
    {
      text: 'Login Now',
      style: 'default',
      onPress: () => router.push('/login'),
    },
  ]
);
```

### Multiple Buttons

```typescript
alertService.show({
  type: 'warning',
  title: 'Delete Account',
  message: 'Are you sure you want to delete your account? This action cannot be undone.',
  buttons: [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: () => handleDeleteAccount(),
    },
  ],
});
```

### Confirmation Dialog

```typescript
alertService.confirm(
  'Confirm Order',
  'Are you sure you want to place this order?',
  () => {
    // User confirmed
    placeOrder();
  },
  () => {
    // User cancelled
    console.log('Order cancelled');
  },
  'Place Order',  // Confirm button text
  'Cancel'        // Cancel button text
);
```

## Button Styles

- **`default`** - Primary accent color button (green)
- **`cancel`** - Secondary outlined button
- **`destructive`** - Red button for dangerous actions

## Alert Types

### Success (`success`)
- **Icon**: Checkmark circle
- **Color**: Green (#4CAF50)
- **Use for**: Successful operations, confirmations

### Error (`error`)
- **Icon**: Close circle
- **Color**: Red (#ff4757)
- **Use for**: Failed operations, validation errors

### Warning (`warning`)
- **Icon**: Warning triangle
- **Color**: Orange (#FFA726)
- **Use for**: Cautionary messages, confirmations needed

### Info (`info`)
- **Icon**: Information circle
- **Color**: Blue (#2196F3)
- **Use for**: General information, tips

## Error Message Formatting

The alert service automatically formats errors from various sources:

### Backend API Errors

```typescript
// Backend returns: { error: "Email already exists" }
// User sees: "Email already exists"

// Backend returns: { message: "Invalid credentials" }
// User sees: "Invalid credentials"

// Backend returns: { errors: ["Field 1 error", "Field 2 error"] }
// User sees: "Field 1 error\nField 2 error"
```

### Firebase Errors

Common Firebase errors are automatically translated:

| Firebase Code | User-Friendly Message |
|--------------|----------------------|
| `auth/email-already-in-use` | This email is already registered. Please login or use a different email. |
| `auth/invalid-email` | Please enter a valid email address. |
| `auth/weak-password` | Password is too weak. Please use a stronger password. |
| `auth/user-not-found` | No account found with this email address. |
| `auth/wrong-password` | Incorrect password. Please try again. |
| `auth/too-many-requests` | Too many failed attempts. Please try again later. |

### Network Errors

Network errors are automatically detected and displayed as:
> "Network error. Please check your internet connection and try again."

## Examples in Your Codebase

### Signup (signup.tsx)

```typescript
const handleSignUp = async () => {
  try {
    await dispatch(signUpUser(credentials)).unwrap();
    
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
  } catch (error) {
    // Automatically formats backend/Firebase errors
    alertService.error('Sign Up Failed', error);
  }
};
```

### Login (login.tsx)

```typescript
const handleLogin = async () => {
  try {
    await dispatch(signInUser(credentials)).unwrap();
    router.replace('/(tabs)');
  } catch (error) {
    // Automatically formats authentication errors
    alertService.error('Login Failed', error);
  }
};
```

### Fetching Data (signup.tsx)

```typescript
const fetchEstates = async () => {
  try {
    const response = await EstateService.getEstates();
    if (!response.success) {
      alertService.error('Error', 'Failed to load estates. Please try again.');
    }
  } catch (error) {
    alertService.error('Error', error);
  }
};
```

## Best Practices

1. **Use appropriate alert types**: Match the alert type to the message context
2. **Keep messages concise**: Users should understand the issue quickly
3. **Provide actionable buttons**: Give users clear next steps
4. **Let backend messages through**: The service formats them automatically
5. **Use confirmation dialogs for destructive actions**: Always confirm before deleting or making irreversible changes

## Customization

To customize the appearance, edit:
- **Component**: `closebuy/components/CustomAlert.tsx`
- **Service**: `closebuy/utils/alertService.ts`
- **Provider**: `closebuy/components/AlertProvider.tsx`

## Troubleshooting

### Alert not showing
- Ensure `AlertProvider` is wrapped around your app in `_layout.tsx`
- Check that you're importing from the correct path: `@/utils/alertService`

### Error messages not formatted properly
- Check the error object structure in console
- Add custom formatting in `formatErrorMessage()` method in `alertService.ts`

### Theme not applying
- Verify `ThemeContext` is properly set up
- Check that `theme` object has required properties (text, background, accent, etc.)

