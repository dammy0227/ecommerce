import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addCart, removeCart, clearCart, updateCart, getAllCarts } from "../../service/cartApi";

// ADD ITEM
export const addCartThunk = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    try {
      return await addCart(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET CART
export const getCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await getCart();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getAllCartsThunk = createAsyncThunk(
  "cart/getAllCarts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllCarts();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// REMOVE ITEM
export const removeCartThunk = createAsyncThunk(
  "cart/remove",
  async (data, { rejectWithValue }) => {
    try {
      return await removeCart(data); // DELETE /remove + body
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// CLEAR CART
export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      return await clearCart();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE ITEM
export const updateCartThunk = createAsyncThunk(
  "cart/update",
  async (data, { rejectWithValue }) => {
    try {
      return await updateCart(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
