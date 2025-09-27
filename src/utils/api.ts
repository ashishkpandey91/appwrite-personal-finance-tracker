// utils/api.ts (or services/api.ts)
import CONF from "@/conf";
import axios from "axios";

const authApi = axios.create({
  baseURL: CONF.get("API_BASE_URL"), // change to your actual API URL
});

// Automatically add Bearer token to each request
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or get it from cookies, context, etc.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
