import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import * as tokenService from "../services/api/tokenService";
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshResponse = await axios.post(
          `${BASE_API_URL}/auth/refresh/`,
          {},
          { withCredentials: true },
        );
        tokenService.setAccessToken(refreshResponse.data.data.access);

        const accountId = localStorage.getItem("accountId");
        const accountResponse = await axios.get(
          `${BASE_API_URL}/account/${accountId}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${tokenService.getAccessToken()}`,
            },
          },
        );

        setUser(accountResponse.data.data);
      } catch {
        tokenService.clearAccessToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    let account = null;
    try {
      const response = await axios.post(
        `${BASE_API_URL}/auth/login/`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      tokenService.setAccessToken(response.data.data.access);
      account = response.data.data.account;
      localStorage.setItem("accountId", account.id);
      setUser(account);
    } catch (err) {
      console.log(err);
      tokenService.clearAccessToken();
      setUser(null);
    }

    return account;
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_API_URL}/auth/logout/`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
    } finally {
      tokenService.clearAccessToken();
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/auth/refresh/`,
        {},
        { withCredentials: true },
      );
      tokenService.setAccessToken(response.data.data.access);
    } catch {
      tokenService.clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
