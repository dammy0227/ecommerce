import { createSlice } from "@reduxjs/toolkit";
import { registerUserThunk, loginUserThunk } from "./authThunk";

const initialState = {
      user: JSON.parse(localStorage.getItem('user')) || null ,
      token: localStorage.getItem('token') || null,
      loading: false,
      error: null,
}

const authSlice = createSlice({
      name: 'auth',
      initialState,
      reducers:{
            clearError(state){
                  state.error = null
            },
            
            logout(state){
                  state.user = null,
                  state.token = null,
                  localStorage.removeItem('user'),
                  localStorage.removeItem('token')
            }
      },

      extraReducers: (builder)=>{
            builder.addCase(registerUserThunk.pending , (state)=>{
                  state.loading = true,
                  state.error = null
            });
            builder.addCase(registerUserThunk.fulfilled, (state, action)=>{
                  state.loading = false,
                  state.user = action.payload.user,
                  state.token = action.payload.token
            });
            builder.addCase(registerUserThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            });

            // login

            builder.addCase(loginUserThunk.pending, (state)=>{
                  state.loading = true,
                  state.error = null
            });

            builder.addCase(loginUserThunk.fulfilled, (state, action)=>{
                  state.loading = false
                  state.user = action.payload.user,
                  state.token = action.payload.token
            });

            builder.addCase(loginUserThunk.rejected, (state, action)=>{
                  state.loading = false,
                  state.error = action.payload
            })
      }
});

export const {clearError, logout} = authSlice.actions
export default authSlice.reducer