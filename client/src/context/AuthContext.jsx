import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Create context
export const AuthContext = createContext();

// Backend URL from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Axios instance with baseURL
const authAxios = axios.create({
  baseURL: backendUrl,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Check user authentication
  const checkAuth = async () => {
    try {
      const { data } = await authAxios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Session expired.");
      logout();
    }
  };

  // Login function
  const login = async (state, credentials) => {
    try {
      const { data } = await authAxios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAuthToken(data.token);
        connectSocket(data.userData);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    delete authAxios.defaults.headers.common["Authorization"];
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  };

  // Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await authAxios.put("/api/auth/update-profile", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update profile error:", {
        config: error.config,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Connect to socket.io
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  // On mount: check auth if token exists
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      checkAuth();
    }
  }, []);

  //  Include authAxios in the context value
  const value = {
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
    axios: authAxios, // ✅ FIXED: added axios to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
