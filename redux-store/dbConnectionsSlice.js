import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

/**
 * Utility Function: serializeTimestamps
 * Recursively converts all Firestore Timestamp objects into ISO date strings.
 * Ensures Redux state contains serializable data only.
 */
const serializeTimestamps = (obj) => {
  if (obj instanceof Timestamp) return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serializeTimestamps);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeTimestamps(v)])
    );
  return obj;
};

/**
 * Async Thunk: fetchDbConnections
 * Fetches all database connections belonging to the currently logged-in user.
 * Data is retrieved from the Firestore subcollection:
 * users/{userId}/connections
 */
export const fetchDbConnections = createAsyncThunk(
  "dbConnections/fetchDbConnections",
  async (userId, thunkAPI) => {
    try {
      if (!userId) throw new Error("User ID is required to fetch connections.");

      // Reference to user's subcollection: users/{userId}/connections
      const userConnectionsRef = collection(db, "users", userId, "connections");

      // Fetch all connection documents for this user
      const snapshot = await getDocs(userConnectionsRef);

      // Format documents for Redux store
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...serializeTimestamps(doc.data()),
      }));

      return data;
    } catch (error) {
      console.error("Error fetching DB connections:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * Slice: dbConnectionsSlice
 * -------------------------------------
 * Manages state for user's saved database connections.
 * Includes:
 *  - Connection list
 *  - Selected database
 *  - Loading and error states
 */
const dbConnectionsSlice = createSlice({
  name: "dbConnections",
  initialState: {
    connections: [],
    selectedDb: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // setSelectedDb
    // Updates the currently selected database connection in the store.
    setSelectedDb: (state, action) => {
      state.selectedDb = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch: Pending
      .addCase(fetchDbConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Fetch: Fulfilled
      .addCase(fetchDbConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connections = action.payload;

        // Automatically set first connection as default if available
        if (action.payload.length > 0) {
          state.selectedDb = action.payload[0];
        }
      })

      // Fetch: Rejected
      .addCase(fetchDbConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedDb } = dbConnectionsSlice.actions;
export default dbConnectionsSlice.reducer;
