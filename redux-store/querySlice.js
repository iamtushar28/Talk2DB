import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk: sends prompt + db info → backend → returns generated SQL
export const generateQuery = createAsyncThunk(
  "query/generateQuery",
  async ({ prompt, dbType, dbSchema }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/gemini/generate-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, dbType, dbSchema }),
      });

      const data = await res.json();

      // Backend returned error
      if (!res.ok)
        return rejectWithValue(data.error || "Failed to generate query");

      return data.query; // success → return SQL
    } catch (err) {
      // Fetch/network failure
      return rejectWithValue("Network error while generating query");
    }
  }
);

const querySlice = createSlice({
  name: "query",
  initialState: {
    generatedQuery: "", // SQL/Mongo query returned by API
    loading: false, // request loading state
    error: null, // error messages
  },
  reducers: {
    // Reset output + error
    clearQuery(state) {
      state.generatedQuery = "";
      state.error = null;
    },

    // ⭐ NEW: Update generated query manually (for Edit feature)
    updateGeneratedQuery(state, action) {
      state.generatedQuery = action.payload; // store edited query
    },
  },

  extraReducers: (builder) => {
    builder
      // API request started
      .addCase(generateQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // API success
      .addCase(generateQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedQuery = action.payload; // store generated query
      })
      // API failure
      .addCase(generateQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // store error message
      });
  },
});

// Export reducer actions
export const { clearQuery, updateGeneratedQuery } = querySlice.actions;

export default querySlice.reducer;
