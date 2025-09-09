import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse } from "../../../types/auth.type";
import { API_CONFIG } from "../../../config/config";

interface AuthResponse {
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_CONFIG.BASE_URL,
    credentials: 'include', // Để nhận và gửi cookie từ backend
    prepareHeaders: (headers) => {
      // Token được xử lý tự động bằng cookie, không cần thêm vào header
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest & { rememberMe?: boolean }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          role: 'ADMIN' // Gửi role để backend kiểm tra đúng quyền
        }
      }),
      transformResponse: (response: AuthResponse) => {
        // Cookie access_token đã được browser tự động lưu trữ
        // Chỉ cần trả về thông tin người dùng để hiển thị trong ứng dụng
        return {
          user: {
            id: '1', // Backend có thể không trả về id
            name: response.fullName || '',
            email: response.email || '',
            role: response.role || 'ADMIN'
          }
        };
      }
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    }),

    // Kiểm tra trạng thái đăng nhập
    checkAuth: builder.query<LoginResponse, void>({
      query: () => ({
        url: '/auth/me',
        credentials: 'include'  // Đảm bảo gửi cookie trong request này
      }),
      transformResponse: (response: AuthResponse) => {
        return {
          user: {
            id: '1', // Backend có thể không trả về id
            name: response.fullName || '',
            email: response.email || '',
            role: response.role || 'ADMIN'
          }
        };
      }
    })
  }),
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } = authApi;
