import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrder, createOrder, getOrderById, updateOrderStatus, updatePaymentStatus, cancelOrder, getAllOrders } from "../../service/order";

export const createOrderThunk = createAsyncThunk('/order/create', 
      async(data, {rejectWithValue})=>{
            try {
                  const response = await createOrder(data)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data|| error.message)
            }
      }
)

export const getMyOrderThunk = createAsyncThunk('/order/fetchMyOrder', 
      async(_, {rejectWithValue})=>{
            try {
                  const response = await getMyOrder()
                  return response
            } catch (error) {
                   return rejectWithValue(error.response?.data || error.message);
            }
      }
)

export const getMyOrderIdThunk = createAsyncThunk('/order/fetchOrderById', 
      async(orderId, {rejectWithValue})=>{
            try {
                  const response = await getOrderById(orderId)
                  return response
            } catch (error) {
                   return rejectWithValue(error.response?.data || error.message);
            }
      }
)


export const updateOrderStatusThunk = createAsyncThunk(
  "/order/updateStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, {
        orderStatus,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateOrderPaymentThunk = createAsyncThunk('/order/updatePayment', 
      async(orderId, {rejectWithValue})=>{
            try {
                  const response = await updatePaymentStatus(orderId)
                  return response
            } catch (error) {
                   return rejectWithValue(error.response?.data || error.message);
            }
      }
)

export const cancelOrderThunk = createAsyncThunk('/order/cancelOrder', 
      async(orderId, {rejectWithValue})=>{
            try {
                  const response = await cancelOrder(orderId)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message);
            }
      }
)

export const getAllOrdersThunk = createAsyncThunk('/order/fetchAllOrders', 
  async(_, {rejectWithValue}) => {
    try {
      const response = await getAllOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);