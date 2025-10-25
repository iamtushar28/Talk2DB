import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux Slice: authSlice
 * Purpose: Manages authentication state for the application, including
 * the current user object and loading status.
 */
const authSlice = createSlice({
  name: "auth", // Slice name for Redux devtools and actions
  initialState: {
    user: null, // Stores the authenticated user object
    isLoading: true, // Tracks loading state while checking auth
  },
  reducers: {
    /**
     * Sets the authenticated user and marks loading as false.
     * @param state - current slice state
     * @param action.payload - user object
     */
    setUser: (state, action) => {
      state.user = action.payload; // Store user data (should be serializable)
      state.isLoading = false; // Done loading auth state
    },

    /**
     * Clears the user state (e.g., on logout) and sets loading to false.
     * @param state - current slice state
     */
    clearUser: (state) => {
      state.user = null; // Remove user info
      state.isLoading = false; // Done loading
    },

    /**
     * Updates the loading status for authentication checks.
     * @param state - current slice state
     * @param action.payload - boolean indicating loading state
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions for use in components
export const { setUser, clearUser, setLoading } = authSlice.actions;

// Export reducer to configure the Redux store
export default authSlice.reducer;
