import { createContext, useContext, useState, useCallback } from "react";
import apiClient, { setToken, clearToken } from "../services/apiClient";

const AuthContext = createContext(null)

const STORAGE_KEY = "cmsclientdashboard.auth.user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const result = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(result);
  });

  const login = useCallback(async (loginEmail, loginPassword) => {
    try {
      const { data } = await apiClient.post("/auth/tenant/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (data.token) {
        setToken(data.token);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Login failed:", error);

      return {
        success: false,
        error,
      };
    }

  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearToken();
    setUser(null);
  }, []);

  const value = { user, isAuthenticated: Boolean(user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const ctx = useContext(AuthContext)
   if (!ctx) throw new Error('useAuth must be used within AuthProvider')
   return ctx
}