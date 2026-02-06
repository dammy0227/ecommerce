import { createAsyncThunk } from "@reduxjs/toolkit";
import { profile, updateProfile,getAllUser } from "../../service/userApi";

export const profileThunk = createAsyncThunk('users/profile',
      async(_, {rejectWithValue})=>{
            try {
                  const response = await profile()
            return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)

export const updateProfileThunk = createAsyncThunk('users/updateProfile',
      async(userData, {rejectWithValue})=>{
            try {
                  const response = await updateProfile(userData)
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)

export const getAllUserThunk = createAsyncThunk('users/allUsers', 
      async(_, {rejectWithValue})=>{
            try {
                  const response = await getAllUser()
                  return response
            } catch (error) {
                  return rejectWithValue(error.response?.data || error.message)
            }
      }
)