import { createSlice } from "@reduxjs/toolkit";
import { getMyOrderThunk, getMyOrderIdThunk,createOrderThunk,cancelOrderThunk,updateOrderPaymentThunk, updateOrderStatusThunk, getAllOrdersThunk } from "./orderThunk";

const initialState = {
      orders: [],
        allOrders: [],
      currentOrder: null,
      error: null,
      loading: true
}

const orderSlice = createSlice({
      name: 'order',
      initialState,
      reducers:{
            clearOrdeError : (state)=>{
                  state.error = null
            },

            filterOrders: (state, action)=>{
                 const search = action.payload.toLowerCase();
      state.orders = state.allOrders.filter(order =>
        order._id.toLowerCase().includes(search) ||
        (order.user?.fullName && order.user.fullName.toLowerCase().includes(search)) ||
        (order.user?.email && order.user.email.toLowerCase().includes(search)) ||
        order.orderStatus?.toLowerCase().includes(search) ||
        order.paymentStatus?.toLowerCase().includes(search));
            },
            resetFilter: (state)=>{
                  state.orders = state.allOrders;  
            }
      },

      extraReducers: (builder)=>{
            builder

            // getMyOrder
            .addCase(getMyOrderThunk.pending, (state)=>{
                  state.loading = true,
                  state.error = null
            })
            .addCase(getMyOrderThunk.fulfilled, (state, action)=>{
                  state.loading = false,
                  state.orders = action.payload.orders,
                  state.allOrders = action.payload.orders; 
            })
            .addCase(getMyOrderThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            })



            builder
            // create order 
            .addCase(createOrderThunk.pending, (state)=>{
                  state.loading = true,
                  state.error = null
            })
           .addCase(createOrderThunk.fulfilled, (state, action)=>{
  state.loading = false;
  state.orders.push(action.payload.order);
  state.currentOrder = action.payload.order;
})

            .addCase(createOrderThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            })



            builder
            // getMyOrderById
            .addCase(getMyOrderIdThunk.pending, (state)=>{
                  state.loading = true
            })
            .addCase(getMyOrderIdThunk.fulfilled, (state, action)=>{
                  state.loading = false,
                  state.currentOrder = action.payload.order;
            })
              .addCase(getMyOrderIdThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            })



            builder
            // cancel order 
            .addCase(cancelOrderThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
             .addCase(cancelOrderThunk.fulfilled, (state, action)=>{
                  state.loading = false,
                  state.orders = state.orders.map((order)=> order._id === action.payload.order._id ? action.payload.order : order),
                  state.currentOrder = state.currentOrder && state.currentOrder._id === action.payload.order._id ? action.payload.order
                  : state.currentOrder;
            })
            .addCase(cancelOrderThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
            })


            // Admin 

            builder
            // payment status
            .addCase(updateOrderPaymentThunk.pending, (state)=>{
                  state.loading = true,
                  state.error = null
            })
            .addCase(updateOrderPaymentThunk.fulfilled, (state, action)=>{
                  state.loading = false,
                  state.orders = state.orders.map((order)=> order._id === action.payload.order._id ? action.payload.order : order),
                  state.currentOrder = state.currentOrder && state.currentOrder._id === action.payload.order._id ? action.payload.order
                  : state.currentOrder;
            })
            .addCase(updateOrderPaymentThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            })

            
            builder
            // order status
            .addCase(updateOrderStatusThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                  state.loading = false;
                  state.orders = state.orders.map((order) =>order._id === action.payload.order._id ?  action.payload.order : order)
                  state.currentOrder = state.currentOrder && state.currentOrder._id === action.payload.order._id ? action.payload.order
                  : state.currentOrder;
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
            })
            
            
            builder
                // Add this new case for fetching ALL orders
            .addCase(getAllOrdersThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
            .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
                  state.loading = false;
                  state.allOrders = action.payload.orders; 
            })
            .addCase(getAllOrdersThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
            })
      }
})

export const {clearOrdeError , filterOrders, resetFilter } = orderSlice.actions
export default orderSlice.reducer