import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
  category?: string;
  vendorId?: number;
  shopId?: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      
      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },
    
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      
      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },
    
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
      
      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

