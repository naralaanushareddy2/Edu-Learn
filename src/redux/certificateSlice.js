import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  certificates: [],
  loading: false,
  error: null,
};

const certificateSlice = createSlice({
  name: "certificate",

  initialState,

  reducers: {
    setCertificates: (state, action) => {
      state.certificates = action.payload;
    },

    addCertificate: (state, action) => {
      state.certificates.push(action.payload);
    },

    removeCertificate: (state, action) => {
      state.certificates = state.certificates.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setCertificates,
  addCertificate,
  removeCertificate,
} = certificateSlice.actions;

export default certificateSlice.reducer;