import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Serialize Firebase Timestamps
const serializeTimestamps = (obj) => {
  if (obj instanceof Timestamp) return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serializeTimestamps);
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeTimestamps(v)])
    );
  return obj;
};

// Fetch DB connections
export const fetchDbConnections = createAsyncThunk(
  "dbConnections/fetchDbConnections",
  async (userId, thunkAPI) => {
    try {
      const connectionsRef = collection(db, "mongodb_connections");
      const q = query(connectionsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...serializeTimestamps(doc.data()),
      }));

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dbConnectionsSlice = createSlice({
  name: "dbConnections",
  initialState: {
    connections: [],
    selectedDb: null,
    dbType: "mongodb", // <-- default DB type
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedDb: (state, action) => {
      state.selectedDb = action.payload;
      state.dbType = action.payload?.dbType || "mongodb"; // Update DB type automatically if the DB has a type
    },
    setDbType: (state, action) => {
      state.dbType = action.payload; // manually change DB type
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDbConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDbConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connections = action.payload;
        if (action.payload.length > 0) {
          state.selectedDb = action.payload[0];
          state.dbType = action.payload[0].dbType || "mongodb";
        }
      })
      .addCase(fetchDbConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedDb, setDbType } = dbConnectionsSlice.actions;
export default dbConnectionsSlice.reducer;
