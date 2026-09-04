import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import enrollmentReducer from "./enrollmentSlice";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    enrollment: enrollmentReducer,
    wishlist: wishlistReducer,
  },
});

export default store;