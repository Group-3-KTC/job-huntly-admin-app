import axios from "axios";
import { API_CONFIG } from "./config";

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
});

export const API_V1 = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const MAIL_API = {
    list: `${API_V1}/tickets`,
    messages: (id: number) => `${API_V1}/tickets/${id}/messages`,
    reply: (id: number) => `${API_V1}/tickets/${id}/reply`,
};

