import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // now fully serializable
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
