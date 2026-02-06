import { createSlice } from "@reduxjs/toolkit";
import {profileThunk,updateProfileThunk,getAllUserThunk} from "../user/userThunk";

const initialState = {
      profile: null,
      allUsers: [],
      loading: false,
      error: null,
}

const userSlice = createSlice({
      name: "user",
      initialState,
      reducers: {
            clearUserError: (state) => {
                  state.error = null;
            },
      },
      
      extraReducers: (builder) => {
             builder

            //  profile
            .addCase(profileThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
            .addCase(profileThunk.fulfilled, (state, action) => {
                  state.loading = false;
                  state.profile = action.payload;
            })
            .addCase(profileThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload || "Failed to load profile";
            });

            //UPDATE PROFILE
            builder
            .addCase(updateProfileThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
          .addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = {
            ...state.profile,  // keep role
            ...action.payload.user // override only updated fields
      };
      state.successMessage = action.payload.message;
})

            .addCase(updateProfileThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload || "Failed to update profile";
            });


            //GET ALL USERS
            builder
            .addCase(getAllUserThunk.pending, (state) => {
                  state.loading = true;
                  state.error = null;
            })
            .addCase(getAllUserThunk.fulfilled, (state, action) => {
                  state.loading = false;
                  state.allUsers = action.payload;
            })
            .addCase(getAllUserThunk.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload || "Failed to load users";
            });
      },});

export const { clearUserError, clearSuccess } = userSlice.actions;

export default userSlice.reducer;
