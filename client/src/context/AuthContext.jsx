import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Create AuthContext
export const AuthContext = createContext();

// Get backend URL from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Set axios base URL
const authAxios = axios.create({
  baseURL: backendUrl,
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Set auth token for axios
  const setAuthToken = (token) => {
    authAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ✅ Check auth on page load
  const checkAuth = async () => {
    try {
      const { data } = await authAxios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Session expired.");
      logout(); // logout if token is invalid
    }
  };

  // ✅ Login
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

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    delete authAxios.defaults.headers.common["Authorization"];
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  };

  // ✅ Update Profile
  const updateProfile = async (body) => {
    try {
      const { data } = await authAxios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    }
  };

  // ✅ Connect to Socket.IO
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

  // Auto-check auth on mount
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      checkAuth();
    }
  }, []);

  // Context value
  const value = {
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
