export const API_URL: string =
  (window as any).__ENV__?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
