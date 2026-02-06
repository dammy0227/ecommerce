import { createAsyncThunk } from "@reduxjs/toolkit";
import { register, login } from "../../service/authApi";

export const registerUserThunk = createAsyncThunk('auth/registerUser',
      async(userData, {rejectWithValue})=>{
            try {
                  const response = await register(userData)
                  localStorage.setItem("token", response.token);
                  localStorage.setItem("user", JSON.stringify(response.user));
            return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message);
            }
      }
)


export const loginUserThunk = createAsyncThunk('auth/loginUser', 
      async(userData, {rejectWithValue})=>{
            try {
                  const response = await login(userData)
                  localStorage.setItem("token", response.token);
                  localStorage.setItem("user", JSON.stringify(response.user));
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)