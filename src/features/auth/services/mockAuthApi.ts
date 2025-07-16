import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse } from "../../../types/auth.type.ts";

export const mockAuthApi = createApi({
  reducerPath: "mockAuthApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      async queryFn(credentials) {
        await new Promise((res) => setTimeout(res, 1000));

        if (
          credentials.email === "admin@gmail.com" &&
          credentials.password === "123456"
        ) {
          return {
            data: {
              accessToken: "mock_token",
              user: {
                id: "1",
                name: "Admin",
                email: "admin@gmail.com",
                role: "admin",
              },
            },
          };
        }

        return {
          error: {
            status: 401,
            data: { message: "Invalid credentials" },
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation } = mockAuthApi;
