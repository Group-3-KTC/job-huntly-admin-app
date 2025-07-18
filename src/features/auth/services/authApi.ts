// import { createApi } from "@reduxjs/toolkit/query";
// import { axiosBaseQuery } from "../../../config/axios.config";
// import type { LoginRequest, LoginResponse } from "../../../types/auth.type";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: axiosBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL, // từ `env.ts` nếu có
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         data: credentials,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation } = authApi;
