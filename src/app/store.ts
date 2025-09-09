import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/store/authSlice.ts";
import pageReducer from "../store/pageSlice.ts";
import uiReducer from "../store/uiSlice.ts";
import { authApi } from "../features/auth/services/authApi.ts";

// Import khác nếu có...

export const store = configureStore({
  reducer: {
    auth: authReducer,
    page: pageReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
