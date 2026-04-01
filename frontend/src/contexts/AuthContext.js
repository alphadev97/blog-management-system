import React, { createContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = useCallback(
    async (name, email, password, role = "author") => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
          {
            name,
            email,
            password,
            role,
          },
        );

        const { user: userData, accessToken, refreshToken } = response.data;

        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        return userData;
      } catch (error) {
        throw error.response?.data?.message || "Registration failed";
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
          email,
          password,
        },
      );

      const { user: userData, accessToken, refreshToken } = response.data;

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return userData;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/refresh`,
        {
          refreshToken,
        },
      );

      const { accessToken } = response.data;
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return accessToken;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        register,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
