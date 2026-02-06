import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getProductId, createProduct,updateProduct, deleteProduct } from "../../service/productApi";

export const createProductThunk = createAsyncThunk('products/addProduct', 
      async(FormData, {rejectWithValue})=>{
            try {
                  const response = await createProduct(FormData)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)

export const getProductsThunk = createAsyncThunk(
  "products/fetchProduct",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await getProducts(queryParams); // pass filters/sort/page
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductIdThunk = createAsyncThunk('products/fetchProductId',
      async(productId, {rejectWithValue})=>{
            try {
                  const response = await getProductId(productId)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)

export const updateProductThunk = createAsyncThunk(
  'product/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProductThunk = createAsyncThunk('product/delete', 
      async(id, {rejectWithValue})=>{
            try {
                  const response = await deleteProduct(id)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response.data || error.message)
            }
      }
)