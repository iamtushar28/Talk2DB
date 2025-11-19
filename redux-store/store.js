import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dbConnectionsReducer from "./dbConnectionsSlice";
import queryReducer from "./querySlice";

// Main Redux store configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,             // authentication state
    dbConnections: dbConnectionsReducer, // saved DB connections
    query: queryReducer,           // AI-generated SQL state
  },
});
