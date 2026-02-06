import { createSlice } from "@reduxjs/toolkit";
import { createProductThunk, getProductIdThunk, getProductsThunk, updateProductThunk, deleteProductThunk } from "./productThunk";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // GET PRODUCTS (with backend filters, sort, pagination)
    builder.addCase(getProductsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalProducts = action.payload.totalProducts;
    });
    builder.addCase(getProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to get products";
    });

    // GET PRODUCT BY ID
    builder.addCase(getProductIdThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductIdThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
    });
    builder.addCase(getProductIdThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to get product";
    });

    // CREATE PRODUCT
    builder.addCase(createProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload.product); // add to top
      state.totalProducts += 1;
    });
    builder.addCase(createProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create product";
    });

    // UPDATE PRODUCT
    builder.addCase(updateProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.map((p) =>
        p._id === action.payload.product._id ? action.payload.product : p
      );
    });
    builder.addCase(updateProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update product";
    });

    // DELETE PRODUCT
    builder.addCase(deleteProductThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter((p) => p._id !== action.payload.id);
      state.totalProducts -= 1;
    });
    builder.addCase(deleteProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete product";
    });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
