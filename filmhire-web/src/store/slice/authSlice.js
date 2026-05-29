import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    session: null,
    user: null,
    role: null,
    loading: true,
  },

  reducers: {
    setSession(state, action) {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.loading = false;
    },

    setUser(state, action) {
      state.user = action.payload;
    },

    setRole(state, action) {
      state.role = action.payload;
    },

    clearAuth(state) {
      state.session = null;
      state.user = null;
      state.role = null;
      state.loading = false;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setSession,
  setUser,
  setRole,
  clearAuth,
  setLoading,
} = authSlice.actions;

// Selectors
export const selectSession = (state) => state.auth.session;
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;
export const selectLoading = (state) => state.auth.loading;

export default authSlice.reducer;