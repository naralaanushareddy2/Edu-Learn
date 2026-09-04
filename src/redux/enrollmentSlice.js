import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",

  initialState,

  reducers: {

    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },

    addEnrollment: (state, action) => {
      state.enrollments.push(action.payload);
    },

    updateEnrollment: (state, action) => {

      const index = state.enrollments.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.enrollments[index] = action.payload;
      }

    },

    removeEnrollment: (state, action) => {

      state.enrollments = state.enrollments.filter(
        (item) => item.id !== action.payload
      );

    },

  },
});

export const {
  setEnrollments,
  addEnrollment,
  updateEnrollment,
  removeEnrollment,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;