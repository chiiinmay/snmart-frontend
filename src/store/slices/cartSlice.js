import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage,
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== action.payload.id);
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    setCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
