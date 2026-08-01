import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/models/states/cart-state";

const initialState: CartState = { items: [], hydrated: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    setQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((entry) => entry.productId === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearCart(state) { state.items = []; },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
