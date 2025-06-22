

// src/components/ChatContainer.jsx
import React, { useRef, useEffect, useContext, useState } from 'react';
import assets from '../assets/assets.js';
import { formatMessageTime } from '../lib/utils.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const scrollEnd = useRef();

  const { authUser, onlineUsers } = useContext(AuthContext);
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);

  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className='h-full flex flex-col bg-[#1A1A28]'>
      {/* Top Bar */}
      <div className='flex items-center justify-between p-3 border-b border-[#2D2D52] bg-[#1E1E2D]'>
        <div className='flex items-center gap-3'>
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt="User profile"
            className='w-8 h-8 rounded-full object-cover'
          />
          <div className='flex items-center gap-2'>
            <p className='text-white font-medium'>
              {selectedUser?.fullName || "User"}
              {/* ✅ FIXED: safe check before calling .includes */}
              {Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id) && (
                <span className='w-2 h-2 inline-block ml-2 rounded-full bg-green-500'></span>
              )}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="Back to contacts"
            className='w-5 h-5 cursor-pointer md:hidden'
          />
          <img
            src={assets.help_icon}
            alt="Help"
            className='w-5 h-5 cursor-pointer md:hidden'
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-violet-600/50 scrollbar-track-transparent'>
        {messages.map((msg, index) => (
          <div
            key={`${msg.senderId}-${index}`}
            className={`flex gap-3 ${msg.senderId !== authUser._id ? 'justify-end' : ''}`}
          >
            {msg.senderId === authUser._id && (
              <img
                src={assets.avatar_icon}
                alt="Sender avatar"
                className='w-8 h-8 rounded-full object-cover flex-shrink-0'
              />
            )}

            <div className={`max-w-xs ${msg.senderId !== authUser._id ? 'flex flex-col items-end' : ''}`}>
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Chat media"
                  className='max-w-full rounded-lg cursor-pointer hover:opacity-90'
                />
              ) : (
                <p
                  className={`p-3 rounded-lg text-sm ${
                    msg.senderId !== authUser._id
                      ? 'bg-violet-600 text-white rounded-br-none'
                      : 'bg-[#2D2D52] text-white rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <span className='text-xs text-gray-500 mt-1'>
                {formatMessageTime(msg.createdAt)}
              </span>
            </div>

            {msg.senderId !== authUser._id && (
              <img
                src={selectedUser.profilePic || assets.profile_martin}
                alt="Receiver avatar"
                className='w-8 h-8 rounded-full object-cover flex-shrink-0'
              />
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Area */}
      <div className='p-3 bg-[#1E1E2D] border-t border-[#2D2D52]'>
        <div className='flex items-center gap-2'>
          <div className='flex-1 flex items-center bg-[#2D2D52] rounded-full px-4 py-2'>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
              type="text"
              placeholder="Type a message..."
              className='flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm'
            />
            <input onChange={handleSendImage} type="file" id='image' accept='image/*' hidden />
            <label htmlFor="image" className="cursor-pointer hover:opacity-80">
              <img
                src={assets.gallery_icon}
                alt="Attach image"
                className="w-5 h-5"
              />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2 bg-violet-600 rounded-full hover:bg-violet-700 transition-colors"
            aria-label="Send message"
          >
            <img
              src={assets.send_button}
              alt="Send"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='hidden md:flex flex-col items-center justify-center gap-4 text-gray-400 bg-[#1A1A28] h-full'>
      <img src={assets.logo_icon} alt="App logo" className='w-16 h-16' />
      <p className='text-xl font-medium text-white'>Chat anytime, anywhere</p>
      <p className='text-sm max-w-md text-center px-4'>
        Select a chat to start messaging or search for users to connect with.
      </p>
    </div>
  );
};

export default ChatContainer;
