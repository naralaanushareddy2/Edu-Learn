import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "edulearn_user";

const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user && (user.id || user.email)) {
        return {
          user,
          isAuthenticated: true,
        };
      }
    }
  } catch (err) {
    console.warn("Could not load stored user authentication:", err);
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState = loadStoredUser();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // LOGIN
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      } catch (err) {
        console.warn("Could not persist user authentication:", err);
      }
    },

    // LOGOUT
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (err) {
        console.warn("Could not clear user authentication:", err);
      }
    },

    // UPDATE USER
    updateUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
      } catch (err) {
        console.warn("Could not persist updated user authentication:", err);
      }
    },

  },
});

export const {
  loginUser,
  logoutUser,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;