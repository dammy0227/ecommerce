import { createSlice } from "@reduxjs/toolkit";
import {
  addCartThunk,
  updateCartThunk,
  clearCartThunk,
  getCartThunk,
  removeCartThunk,
  getAllCartsThunk
} from "./cartThunk";

const initialState = {
  cart: { items: [] },
  adminCarts: [], 
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    // ========================
    // GET CART
    // ========================
    builder.addCase(getCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;
    });
    builder.addCase(getCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load cart";
    });


//     GET ALL CART

    builder.addCase(getAllCartsThunk.pending, (state) => {
  state.loading = true;
  state.error = null;
});
builder.addCase(getAllCartsThunk.fulfilled, (state, action) => {
  state.loading = false;
  state.adminCarts = action.payload.carts;
});
builder.addCase(getAllCartsThunk.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Failed to fetch all carts";
});

    // ========================
    // ADD ITEM
    // ========================
    builder.addCase(addCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;
    });
    builder.addCase(addCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add item";
    });

    // ========================
    // UPDATE ITEM
    // ========================
    builder.addCase(updateCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;
    });
    builder.addCase(updateCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update item";
    });

    // ========================
    // REMOVE ITEM
    // ========================
    builder.addCase(removeCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;
    });
    builder.addCase(removeCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to remove item";
    });

    // ========================
    // CLEAR CART
    // ========================
    builder.addCase(clearCartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearCartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload.cart;
    });
    builder.addCase(clearCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to clear cart";
    });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
