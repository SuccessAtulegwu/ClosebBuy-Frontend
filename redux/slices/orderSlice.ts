import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';
import { Order, DeliveryDetail, User } from '@/types/publicTypes';
import { OrderStatus, PaymentStatus, PaymentMethod as PaymentMethodEnum } from '@/types/publicenums';
import { CreateOrderDto, CreateDeliveryDetailDto, OrderItemDto } from '@/types/publicDTOTypes';
import { OrderService } from '@/apiServices/orderService';

export interface ShippingAddress extends Omit<DeliveryDetail, 'id' | 'userId' | 'user' | 'orders'> {
  isDefault?: boolean;
}

export interface PaymentMethodDetails {
  id: string;
  type: PaymentMethodEnum;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  isDefault?: boolean;
}

export interface OrderListItem extends Omit<Order, 'customer' | 'rider' | 'delivery' | 'items' | 'payment'> {
  customerId: number;
  customerName?: string;
  itemCount?: number;
}

interface OrderState {
  currentOrder: Partial<OrderListItem> | null;
  orders: OrderListItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethodDetails | null;
  savedAddresses: ShippingAddress[];
  savedPaymentMethods: PaymentMethodDetails[];
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

// Async thunk for fetching orders from backend
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (params: { status?: OrderStatus; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await OrderService.getOrders(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch orders');
      }
      
      // Transform orders to OrderListItem format
      const orderListItems: OrderListItem[] = response.data.map((order) => ({
        ...order,
        customerId: order.customerId,
        customerName: order.customer?.name,
        itemCount: order.items?.length || 0,
      }));
      
      return orderListItems;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// Async thunk for fetching single order
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await OrderService.getOrderById(orderId);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch order');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

// Async thunk for cancelling order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async ({ orderId, reason }: { orderId: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await OrderService.cancelOrder(orderId, reason);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to cancel order');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
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
    
    setPaymentMethod: (state, action: PayloadAction<PaymentMethodDetails>) => {
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
    
    addSavedPaymentMethod: (state, action: PayloadAction<PaymentMethodDetails>) => {
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
      })
      
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Update order in list
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index >= 0) {
          state.orders[index] = {
            ...state.orders[index],
            status: action.payload.status,
          };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
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

