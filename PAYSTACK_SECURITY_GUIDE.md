# Paystack Payment Security & Best Practices Guide

## 🔐 Critical Security Rules

### **NEVER DO THIS:**
```typescript
// ❌ WRONG - Secret key exposed in frontend
const PAYSTACK_SECRET_KEY = 'sk_live_xxxxx';
```

### **ALWAYS DO THIS:**
```typescript
// ✅ CORRECT - Secret key on backend only
// Frontend uses public key only
const PAYSTACK_PUBLIC_KEY = 'pk_live_xxxxx';
```

---

## 🏗️ Recommended Architecture

### 1. **Three-Tier Payment Flow (Most Secure)**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Mobile    │────▶│   Backend   │────▶│  Paystack   │
│     App     │◀────│   Server    │◀────│     API     │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Flow:**
1. Mobile → Backend: Request payment initialization
2. Backend → Paystack: Initialize transaction (with secret key)
3. Paystack → Backend: Return authorization URL/reference
4. Backend → Mobile: Send reference and public key
5. Mobile → Paystack: User completes payment via WebView
6. Paystack → Mobile: Payment callback
7. Mobile → Backend: Request verification
8. Backend → Paystack: Verify transaction (with secret key)
9. Backend → Mobile: Confirm payment
10. Paystack → Backend Webhook: Final confirmation (async)

---

## 🛡️ Security Implementation

### Step 1: Update Backend API Service

Create a secure backend payment service:

```typescript
// closebuy/apiServices/securePaymentService.ts
import { Payment } from '@/types/publicTypes';
import { PaymentStatus } from '@/types/publicenums';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.closebuy.com/v1';

interface InitializePaymentRequest {
  orderId: number;
  amount: number;
  email: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, any>;
}

interface InitializePaymentResponse {
  success: boolean;
  reference: string;
  authorization_url?: string;
  access_code?: string;
  publicKey: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  payment?: Payment;
  status: PaymentStatus;
  error?: string;
}

export const SecurePaymentService = {
  /**
   * Initialize payment - Backend handles secret key
   */
  initializePayment: async (
    data: InitializePaymentRequest,
    token: string
  ): Promise<InitializePaymentResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to initialize payment');
      }

      return {
        success: true,
        reference: result.reference,
        authorization_url: result.authorization_url,
        access_code: result.access_code,
        publicKey: result.publicKey,
      };
    } catch (error: any) {
      return {
        success: false,
        reference: '',
        publicKey: '',
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Verify payment - Backend validates with Paystack
   */
  verifyPayment: async (
    reference: string,
    token: string
  ): Promise<VerifyPaymentResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment verification failed');
      }

      return {
        success: true,
        payment: result.payment,
        status: result.status,
      };
    } catch (error: any) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Check payment status
   */
  checkPaymentStatus: async (
    orderId: number,
    token: string
  ): Promise<{ status: PaymentStatus; reference?: string }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/status/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      return {
        status: result.status,
        reference: result.reference,
      };
    } catch (error) {
      return {
        status: PaymentStatus.PENDING,
      };
    }
  },

  /**
   * Request refund
   */
  requestRefund: async (
    paymentId: number,
    reason: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId, reason }),
      });

      const result = await response.json();

      return {
        success: response.ok,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default SecurePaymentService;
```

---

### Step 2: Create Payment Redux Slice

```typescript
// closebuy/redux/slices/paymentSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from '@/types/publicTypes';
import { PaymentStatus } from '@/types/publicenums';
import SecurePaymentService from '@/apiServices/securePaymentService';

interface PaymentState {
  currentPayment: Payment | null;
  reference: string | null;
  status: PaymentStatus;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const initialState: PaymentState = {
  currentPayment: null,
  reference: null,
  status: PaymentStatus.PENDING,
  loading: false,
  error: null,
  retryCount: 0,
};

// Async thunks
export const initializePayment = createAsyncThunk(
  'payment/initialize',
  async (
    data: {
      orderId: number;
      amount: number;
      email: string;
      phone?: string;
      name?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await SecurePaymentService.initializePayment(data, token);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to initialize payment');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async (reference: string, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await SecurePaymentService.verifyPayment(reference, token);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment verification failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setReference: (state, action: PayloadAction<string>) => {
      state.reference = action.payload;
    },
    
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload;
    },

    incrementRetry: (state) => {
      state.retryCount += 1;
    },

    resetPayment: (state) => {
      state.currentPayment = null;
      state.reference = null;
      state.status = PaymentStatus.PENDING;
      state.loading = false;
      state.error = null;
      state.retryCount = 0;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Initialize Payment
      .addCase(initializePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.reference = action.payload.reference;
        state.status = PaymentStatus.PENDING;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = PaymentStatus.FAILED;
      })

      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload.payment || null;
        state.status = action.payload.status;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = PaymentStatus.FAILED;
      });
  },
});

export const {
  setReference,
  setPaymentStatus,
  incrementRetry,
  resetPayment,
  clearError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
```

---

### Step 3: Secure Payment Component

```typescript
// closebuy/components/SecurePaymentModal.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Modal, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { initializePayment, verifyPayment, resetPayment, incrementRetry } from '@/redux/slices/paymentSlice';
import { PaymentStatus } from '@/types/publicenums';

interface SecurePaymentModalProps {
  visible: boolean;
  orderId: number;
  amount: number;
  email: string;
  phone?: string;
  name?: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

const MAX_RETRY_ATTEMPTS = 3;
const VERIFICATION_TIMEOUT = 30000; // 30 seconds

export function SecurePaymentModal({
  visible,
  orderId,
  amount,
  email,
  phone,
  name,
  onSuccess,
  onCancel,
  onError,
}: SecurePaymentModalProps) {
  const dispatch = useAppDispatch();
  const payment = useAppSelector((state) => state.payment);
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);
  
  const [verifying, setVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Initialize payment when modal opens
  useEffect(() => {
    if (visible && !payment.reference) {
      handleInitializePayment();
    }
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (payment.status === PaymentStatus.SUCCESS || 
          payment.status === PaymentStatus.FAILED) {
        dispatch(resetPayment());
      }
    };
  }, []);

  const handleInitializePayment = async () => {
    try {
      const result = await dispatch(
        initializePayment({
          orderId,
          amount,
          email,
          phone,
          name,
        })
      ).unwrap();

      console.log('Payment initialized:', result.reference);
    } catch (error: any) {
      Alert.alert(
        'Payment Initialization Failed',
        error || 'Unable to start payment process. Please try again.',
        [{ text: 'OK', onPress: onCancel }]
      );
    }
  };

  const handlePaystackSuccess = async (response: any) => {
    console.log('Paystack success callback:', response);
    
    if (!response.reference) {
      onError('Invalid payment response');
      return;
    }

    // Start verification with timeout protection
    setVerifying(true);
    const verificationTimer = setTimeout(() => {
      if (verifying) {
        handleVerificationTimeout();
      }
    }, VERIFICATION_TIMEOUT);

    try {
      await verifyPaymentWithRetry(response.reference);
      clearTimeout(verificationTimer);
    } catch (error) {
      clearTimeout(verificationTimer);
      handleVerificationError(error);
    }
  };

  const verifyPaymentWithRetry = async (
    reference: string,
    attempt: number = 1
  ): Promise<void> => {
    try {
      console.log(`Verifying payment (attempt ${attempt})...`);
      
      const result = await dispatch(verifyPayment(reference)).unwrap();

      if (result.status === PaymentStatus.SUCCESS) {
        setVerifying(false);
        onSuccess(reference);
      } else if (result.status === PaymentStatus.PENDING && attempt < MAX_RETRY_ATTEMPTS) {
        // Retry after delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return verifyPaymentWithRetry(reference, attempt + 1);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      if (attempt < MAX_RETRY_ATTEMPTS) {
        console.log(`Verification failed, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return verifyPaymentWithRetry(reference, attempt + 1);
      }
      throw error;
    }
  };

  const handleVerificationTimeout = () => {
    setVerifying(false);
    Alert.alert(
      'Payment Verification Timeout',
      'We are still processing your payment. Please check your order status in a few minutes.',
      [
        {
          text: 'Check Status',
          onPress: () => {
            // Navigate to order status screen
            onCancel();
          },
        },
        {
          text: 'OK',
          onPress: onCancel,
        },
      ]
    );
  };

  const handleVerificationError = (error: any) => {
    setVerifying(false);
    Alert.alert(
      'Payment Verification Failed',
      'Your payment may have been processed, but we couldn\'t verify it. Please check your order status or contact support.',
      [
        {
          text: 'OK',
          onPress: () => onError(error?.message || 'Verification failed'),
        },
      ]
    );
  };

  const handlePaystackCancel = (response: any) => {
    console.log('Payment cancelled:', response);
    Alert.alert(
      'Payment Cancelled',
      'You cancelled the payment. Would you like to try again?',
      [
        { text: 'No', onPress: onCancel },
        {
          text: 'Retry',
          onPress: () => {
            dispatch(resetPayment());
            handleInitializePayment();
          },
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.content}>
          {payment.loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00A86B" />
              <Text style={styles.loadingText}>Initializing payment...</Text>
            </View>
          )}

          {verifying && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00A86B" />
              <Text style={styles.loadingText}>Verifying payment...</Text>
              <Text style={styles.subText}>Please wait...</Text>
            </View>
          )}

          {payment.reference && !payment.loading && !verifying && (
            <Paystack
              paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
              billingEmail={email}
              billingName={name || ''}
              billingMobile={phone || ''}
              amount={amount * 100} // Convert to kobo
              currency="NGN"
              channels={['card', 'bank', 'ussd', 'qr']}
              onCancel={handlePaystackCancel}
              onSuccess={handlePaystackSuccess}
              ref={paystackWebViewRef}
              activityIndicatorColor="#00A86B"
              SafeAreaViewContainer={{ flex: 1 }}
              SafeAreaViewContainerModal={{ flex: 1 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
});
```

---

## 🎯 Attack Prevention Strategies

### 1. **Prevent Double Payments**

```typescript
// Add payment lock to prevent duplicate submissions
const [paymentInProgress, setPaymentInProgress] = useState(false);

const handlePayment = async () => {
  if (paymentInProgress) {
    Alert.alert('Payment in Progress', 'Please wait for the current payment to complete.');
    return;
  }

  setPaymentInProgress(true);
  try {
    // Process payment
  } finally {
    setPaymentInProgress(false);
  }
};
```

### 2. **Prevent Amount Manipulation**

```typescript
// Backend validation (CRITICAL)
// Never trust amounts from frontend
app.post('/payments/initialize', async (req, res) => {
  const { orderId } = req.body;
  
  // Fetch order from database
  const order = await db.orders.findById(orderId);
  
  // Use database amount, NOT client-provided amount
  const amountToCharge = order.total;
  
  // Initialize with verified amount
  const paystackResponse = await paystack.transaction.initialize({
    amount: amountToCharge * 100,
    email: order.customerEmail,
    reference: generateReference(),
  });
  
  res.json(paystackResponse);
});
```

### 3. **Implement Idempotency**

```typescript
// Generate unique idempotency key for each payment attempt
const generateIdempotencyKey = (orderId: number): string => {
  return `${orderId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Store in payment metadata
const initializePayment = async (orderId: number) => {
  const idempotencyKey = generateIdempotencyKey(orderId);
  
  await SecurePaymentService.initializePayment({
    orderId,
    metadata: {
      idempotency_key: idempotencyKey,
      order_id: orderId,
      timestamp: new Date().toISOString(),
    },
  });
};
```

### 4. **Implement Webhook Verification (Backend)**

```typescript
// Backend webhook endpoint
const crypto = require('crypto');

app.post('/webhooks/paystack', (req, res) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    // Invalid signature - potential attack
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  // Handle different event types
  switch (event.event) {
    case 'charge.success':
      // Update order status
      updateOrderStatus(event.data.reference, 'paid');
      break;
    
    case 'charge.failed':
      // Handle failed payment
      updateOrderStatus(event.data.reference, 'failed');
      break;
  }

  res.status(200).send('Webhook received');
});
```

### 5. **Implement Rate Limiting**

```typescript
// Add rate limiting to prevent spam
const paymentAttempts = new Map<string, number>();

const checkRateLimit = (userId: string): boolean => {
  const attempts = paymentAttempts.get(userId) || 0;
  
  if (attempts >= 5) {
    return false; // Rate limit exceeded
  }
  
  paymentAttempts.set(userId, attempts + 1);
  
  // Reset after 1 hour
  setTimeout(() => {
    paymentAttempts.delete(userId);
  }, 3600000);
  
  return true;
};
```

---

## 📊 Payment Status State Machine

```typescript
export enum PaymentState {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  AWAITING_USER = 'AWAITING_USER',
  PROCESSING = 'PROCESSING',
  VERIFYING = 'VERIFYING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDING = 'REFUNDING',
  REFUNDED = 'REFUNDED',
}

// Valid state transitions
const validTransitions: Record<PaymentState, PaymentState[]> = {
  [PaymentState.IDLE]: [PaymentState.INITIALIZING],
  [PaymentState.INITIALIZING]: [PaymentState.AWAITING_USER, PaymentState.FAILED],
  [PaymentState.AWAITING_USER]: [PaymentState.PROCESSING, PaymentState.CANCELLED],
  [PaymentState.PROCESSING]: [PaymentState.VERIFYING, PaymentState.FAILED],
  [PaymentState.VERIFYING]: [PaymentState.SUCCESS, PaymentState.FAILED],
  [PaymentState.SUCCESS]: [PaymentState.REFUNDING],
  [PaymentState.FAILED]: [PaymentState.INITIALIZING],
  [PaymentState.CANCELLED]: [PaymentState.INITIALIZING],
  [PaymentState.REFUNDING]: [PaymentState.REFUNDED, PaymentState.FAILED],
  [PaymentState.REFUNDED]: [],
};
```

---

## 🔄 Error Handling & Retry Logic

```typescript
interface PaymentError {
  code: string;
  message: string;
  retryable: boolean;
  action: 'retry' | 'contact_support' | 'use_different_method';
}

const handlePaymentError = (error: any): PaymentError => {
  // Network errors
  if (error.message?.includes('Network')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet and try again.',
      retryable: true,
      action: 'retry',
    };
  }

  // Card errors
  if (error.message?.includes('declined') || error.message?.includes('insufficient')) {
    return {
      code: 'CARD_DECLINED',
      message: 'Your card was declined. Please try a different payment method.',
      retryable: false,
      action: 'use_different_method',
    };
  }

  // Timeout errors
  if (error.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT',
      message: 'Payment verification timed out. We will notify you once confirmed.',
      retryable: true,
      action: 'contact_support',
    };
  }

  // Default error
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please contact support.',
    retryable: false,
    action: 'contact_support',
  };
};
```

---

## 📱 Usage in Payment Screen

```typescript
// In your payment screen
import { SecurePaymentModal } from '@/components/SecurePaymentModal';

const [showPayment, setShowPayment] = useState(false);
const order = useAppSelector((state) => state.order.currentOrder);
const user = useAppSelector((state) => state.auth.user);

const handleProceedToPayment = () => {
  if (!order || !user) {
    Alert.alert('Error', 'Order or user information is missing');
    return;
  }

  setShowPayment(true);
};

const handlePaymentSuccess = (reference: string) => {
  setShowPayment(false);
  navigation.navigate('OrderSuccess', { reference });
};

const handlePaymentCancel = () => {
  setShowPayment(false);
};

const handlePaymentError = (error: string) => {
  setShowPayment(false);
  Alert.alert('Payment Error', error);
};

return (
  <View>
    <TouchableOpacity onPress={handleProceedToPayment}>
      <Text>Pay Now</Text>
    </TouchableOpacity>

    <SecurePaymentModal
      visible={showPayment}
      orderId={order.id}
      amount={order.total}
      email={user.email}
      phone={user.phone}
      name={user.name}
      onSuccess={handlePaymentSuccess}
      onCancel={handlePaymentCancel}
      onError={handlePaymentError}
    />
  </View>
);
```

---

## ✅ Security Checklist

- [ ] Secret keys are NEVER in frontend code
- [ ] All payment amounts validated on backend
- [ ] Payment verification always done on backend
- [ ] Webhook signature verification implemented
- [ ] Rate limiting implemented
- [ ] Idempotency keys used
- [ ] Payment state machine prevents invalid transitions
- [ ] Retry logic with exponential backoff
- [ ] Timeout handling implemented
- [ ] Proper error handling and user feedback
- [ ] Payment references are unique and unpredictable
- [ ] User authentication required for payments
- [ ] HTTPS/TLS for all API communication
- [ ] Logging and monitoring for suspicious activity
- [ ] Regular security audits

---

## 🎓 Testing Strategy

### Test Paystack Cards
```
Card Number: 4084084084084081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Test Scenarios
1. Successful payment
2. Declined card
3. Network failure during payment
4. Network failure during verification
5. Cancelled payment
6. Timeout during verification
7. Multiple rapid payment attempts
8. Amount manipulation attempt
9. Duplicate reference handling
10. Webhook verification

---

**Remember**: Payment security is critical. When in doubt, validate on the backend!

