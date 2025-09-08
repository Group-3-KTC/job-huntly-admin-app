import { configureStore } from "@reduxjs/toolkit";
import { mockAuthApi } from "../features/auth/services/mockAuthApi.ts";
import authReducer from "../features/auth/store/authSlice";
import pageReducer from "../store/pageSlice.ts";
import uiReducer from "../store/uiSlice.ts";
import mailReducer from "../features/mail/store/mailSlice.ts";

export const store = configureStore({
  reducer: {
    // [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    page: pageReducer,
    ui: uiReducer,
    mail: mailReducer,
    [mockAuthApi.reducerPath]: mockAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(authApi.middleware),
    getDefaultMiddleware().concat(mockAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
