import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dbConnectionsReducer from "./dbConnectionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dbConnections: dbConnectionsReducer,
  },
});
