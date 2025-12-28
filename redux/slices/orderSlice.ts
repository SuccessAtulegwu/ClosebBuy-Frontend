import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'bank_transfer' | 'wallet';
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

interface OrderState {
  currentOrder: Partial<Order> | null;
  orders: Order[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  savedAddresses: ShippingAddress[];
  savedPaymentMethods: PaymentMethod[];
  deliveryFee: number;
  tax: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  shippingAddress: null,
  paymentMethod: null,
  savedAddresses: [],
  savedPaymentMethods: [],
  deliveryFee: 500, // Default delivery fee
  tax: 0,
  loading: false,
  error: null,
};

// Async thunks for API calls (ready for backend integration)
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await orderService.createOrder(orderData);
      // return response.data;
      
      // Mock response for now
      const mockOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      } as Order;
      
      return mockOrder;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await orderService.getOrders();
      // return response.data;
      
      // Mock response for now
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    
    addSavedAddress: (state, action: PayloadAction<ShippingAddress>) => {
      const existingIndex = state.savedAddresses.findIndex(
        addr => addr.address === action.payload.address
      );
      
      if (existingIndex >= 0) {
        state.savedAddresses[existingIndex] = action.payload;
      } else {
        state.savedAddresses.push(action.payload);
      }
    },
    
    removeSavedAddress: (state, action: PayloadAction<string>) => {
      state.savedAddresses = state.savedAddresses.filter(
        addr => addr.address !== action.payload
      );
    },
    
    addSavedPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      const existingIndex = state.savedPaymentMethods.findIndex(
        pm => pm.id === action.payload.id
      );
      
      if (existingIndex >= 0) {
        state.savedPaymentMethods[existingIndex] = action.payload;
      } else {
        state.savedPaymentMethods.push(action.payload);
      }
    },
    
    removeSavedPaymentMethod: (state, action: PayloadAction<string>) => {
      state.savedPaymentMethods = state.savedPaymentMethods.filter(
        pm => pm.id !== action.payload
      );
    },
    
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
    
    calculateTax: (state, action: PayloadAction<number>) => {
      // Calculate 7.5% VAT (adjust based on your requirements)
      state.tax = action.payload * 0.075;
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.shippingAddress = null;
      state.paymentMethod = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setShippingAddress,
  setPaymentMethod,
  addSavedAddress,
  removeSavedAddress,
  addSavedPaymentMethod,
  removeSavedPaymentMethod,
  setDeliveryFee,
  calculateTax,
  clearCurrentOrder,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;

