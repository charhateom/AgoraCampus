

// src/context/ChatContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, axios } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        console.log("🚀 Users fetched:", data.users); //  Only show useful part
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.message || error.message || "Error fetching users");
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messagesData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messagesData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const subscribeToMessage = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };



  const getPosts = async () => {
  setPostLoading(true);
  try {
    const { data } = await authAxios.get('/api/posts');
    if (data.success) {
      setPosts(data.posts);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setPostLoading(false);
  }
  };

  const createPost = async (postData) => {
    try {
      const { data } = await authAxios.post('/api/posts', postData);
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        return data.post;
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  // Call getUsers only once on mount
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    posts,
    postLoading,
    getPosts,
    createPost
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
