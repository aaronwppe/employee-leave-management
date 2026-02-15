import axios from "axios";
import * as tokenService from "./tokenService";

let authContext;

export const setAuthContext = (context) => {
  authContext = context;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (responseError) => {
    const requestConfig = responseError.config;

    if (responseError.response?.status === 401 && !requestConfig.retry) {
      requestConfig.retry = true;

      await authContext.refreshToken();

      const accessToken = tokenService.getAccessToken();

      if (accessToken) {
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;
        return api(requestConfig);
      }
    }

    return Promise.reject(responseError);
  },
);

export default api;
