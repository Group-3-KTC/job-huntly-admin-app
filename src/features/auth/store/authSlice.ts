import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  authInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("admin_token"),
  user: JSON.parse(localStorage.getItem("admin_user") || "null"),
  token: localStorage.getItem("admin_token"),
  authInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
    },
    setAuthInitialized: (state) => {
      state.authInitialized = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    },
  },
});

export const { loginSuccess, logout, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
