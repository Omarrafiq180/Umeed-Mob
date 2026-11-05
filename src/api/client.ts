import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

export const TOKEN_KEY = "token";

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) onUnauthorized?.();
    return Promise.reject(err);
  }
);

// Turns the server's { message } or a network error into readable text
export const errorMessage = (e: any): string =>
  e?.response?.data?.message ?? (e?.message === "Network Error" ? "Could not connect to the server. Check your internet connection or the API address." : e?.message) ?? "Something went wrong";

export default api;