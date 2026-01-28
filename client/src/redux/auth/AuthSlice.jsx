import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "AuthSliceName",
  initialState: { 
    username: null, 
    isAdmin: false 
  },
  reducers: {
    LoginUser: (state, action) => { 
      state.username = action.payload.username;
      state.isAdmin = action.payload.isAdmin;
    },
    LogoutUser: (state) => { 
      state.username = null;
      state.isAdmin = false;
    },
  }
});

export const { LoginUser, LogoutUser } = AuthSlice.actions;
export const selectUsername = (state) => state.AuthSliceName.username;
export const selectRole = (state) => state.AuthSliceName.isAdmin;
export default AuthSlice.reducer;