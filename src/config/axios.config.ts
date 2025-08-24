import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: Record<string, unknown>;
}

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ url, method, data, params }: AxiosBaseQueryArgs) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
