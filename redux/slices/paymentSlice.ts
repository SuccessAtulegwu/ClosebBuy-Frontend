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
  publicKey: string | null;
}

const initialState: PaymentState = {
  currentPayment: null,
  reference: null,
  status: PaymentStatus.PENDING,
  loading: false,
  error: null,
  retryCount: 0,
  publicKey: null,
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
      metadata?: Record<string, any>;
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

export const checkPaymentStatus = createAsyncThunk(
  'payment/checkStatus',
  async (orderId: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await SecurePaymentService.checkPaymentStatus(orderId, token);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check payment status');
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
      state.publicKey = null;
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
        state.publicKey = action.payload.publicKey;
        state.status = PaymentStatus.PENDING;
        state.error = null;
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
        state.error = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = PaymentStatus.FAILED;
      })

      // Check Payment Status
      .addCase(checkPaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.reference = action.payload.reference || state.reference;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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

