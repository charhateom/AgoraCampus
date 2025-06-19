import React, { useRef, useEffect } from 'react';
import assets, { messagesDummyData } from '../assets/assets.js';
import { formatMessageTime } from '../lib/utils.js';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData, selectedUser]);

  return selectedUser ? (
    <div className='h-full flex flex-col bg-[#1A1A28]'>
      {/* Top Bar */}
      <div className='flex items-center justify-between p-3 border-b border-[#2D2D52] bg-[#1E1E2D]'>
        <div className='flex items-center gap-3'>
          <img 
            src={assets.profile_martin} 
            alt="User profile" 
            className='w-8 h-8 rounded-full object-cover' 
          />
          <div className='flex items-center gap-2'>
            <p className='text-white font-medium'>{selectedUser?.fullName || "User"}</p>
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
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
        {messagesDummyData.map((msg, index) => (
          <div
            key={`${msg.senderId}-${index}`}
            className={`flex gap-3 ${msg.senderId !== '680f50e4f10f3cd28382ecf9' ? 'justify-end' : ''}`}
          >
            {msg.senderId === '680f50e4f10f3cd28382ecf9' && (
              <img
                src={assets.avatar_icon}
                alt="Sender avatar"
                className='w-8 h-8 rounded-full object-cover flex-shrink-0'
              />
            )}

            <div className={`max-w-xs ${msg.senderId !== '680f50e4f10f3cd28382ecf9' ? 'flex flex-col items-end' : ''}`}>
              {msg.image ? (
                <img 
                  src={msg.image} 
                  alt="Chat media" 
                  className='max-w-full rounded-lg cursor-pointer hover:opacity-90' 
                />
              ) : (
                <p
                  className={`p-3 rounded-lg text-sm ${msg.senderId !== '680f50e4f10f3cd28382ecf9'
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

            {msg.senderId !== '680f50e4f10f3cd28382ecf9' && (
              <img
                src={assets.profile_martin}
                alt="Sender avatar"
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
              type="text" 
              placeholder="Type a message..."
              className='flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm'
            />
            <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image" className="cursor-pointer hover:opacity-80">
              <img 
                src={assets.gallery_icon} 
                alt="Attach image" 
                className="w-5 h-5"
              />
            </label>
          </div>
          <button 
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