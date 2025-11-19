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
    generatedQuery: "", // SQL returned by API
    loading: false, // request state
    error: null, // error messages
  },
  reducers: {
    // Reset output + error
    clearQuery(state) {
      state.generatedQuery = "";
      state.error = null;
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
        state.generatedQuery = action.payload;
      })
      // API failure
      .addCase(generateQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuery } = querySlice.actions;
export default querySlice.reducer;
