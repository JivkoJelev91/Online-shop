import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { CartItem } from '../types/cartItem';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<CartItem[]>('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/cart');
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateCartItemAsync = createAsyncThunk<CartItem, { id: number; quantity: number }>('cart/update', async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/cart/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return res.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const removeCartItemAsync = createAsyncThunk<number, number>('cart/remove', async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove cart item');
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    updateCartItem(state, action: PayloadAction<CartItem>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeCartItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(i => i.id !== action.payload);
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCart, addToCart, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
