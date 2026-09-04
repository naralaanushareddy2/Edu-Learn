import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // LOGIN
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // LOGOUT
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    // UPDATE USER
    updateUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

  },
});

export const {
  loginUser,
  logoutUser,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;