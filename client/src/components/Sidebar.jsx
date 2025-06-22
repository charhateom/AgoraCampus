import React, { useState, useContext, useEffect } from 'react';
import asset from '../assets/assets.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ChatContext } from '../context/ChatContext.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ current route
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { logout, onlineUsers = [] } = useContext(AuthContext);
  const {
    getUsers,
    users = [],
    setSelectedUser,
    selectedUser,
    unseenMessages = {},
  } = useContext(ChatContext);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  //  Check current path
  const isOnCommunityPage = location.pathname === '/community';

  return (
    <div
      className={`bg-[#1E1E2D] h-full p-4 overflow-y-auto text-white flex flex-col justify-between ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className='flex justify-between items-center pb-4 border-b border-[#2D2D52]'>
          <img src={asset.logo} alt='logo' className='h-10' />
          <div className='relative'>
            <img
              src={asset.menu_icon}
              alt='Menu'
              className='w-5 h-5 cursor-pointer hover:opacity-80'
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className='absolute right-0 mt-2 bg-[#2D2D52] p-2 rounded-lg shadow-lg w-40 z-10'>
                <p
                  onClick={() => navigate('/profile')}
                  className='cursor-pointer p-2 text-sm hover:bg-[#3E3E5E] rounded'
                >
                  Edit Profile
                </p>
                <hr className='my-1 border-t border-[#3E3E5E]' />
                <p
                  onClick={logout}
                  className='cursor-pointer p-2 text-sm hover:bg-[#3E3E5E] rounded'
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className='flex items-center gap-2 mt-4 mb-4 bg-[#2D2D52] px-4 py-2 rounded-full'>
          <img
            src={asset.search_icon}
            alt='Search'
            className='w-4 h-4 opacity-70'
          />
          <input
            type='text'
            placeholder='Search contacts...'
            className='bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User List */}
        <div className='space-y-1'>
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                onClick={() => setSelectedUser(user)}
                key={user._id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?._id === user._id
                    ? 'bg-violet-600/30'
                    : 'hover:bg-[#2D2D52]'
                }`}
              >
                <div className='relative'>
                  <img
                    src={user?.profilePic || asset.avatar_icon}
                    alt='avatar'
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  {onlineUsers?.includes(user._id) && (
                    <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#1E1E2D]'></span>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <p className='font-medium truncate'>{user.fullName}</p>
                  <p
                    className={`text-xs truncate ${
                      onlineUsers?.includes(user._id)
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {onlineUsers?.includes(user._id)
                      ? 'Online'
                      : 'Last seen recently'}
                  </p>
                </div>

                {unseenMessages[user._id] > 0 && (
                  <span className='text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-600/50'>
                    {unseenMessages[user._id]}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className='text-center text-sm text-gray-400 mt-8'>
              No users found.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section – Dynamic Button */}
      <div className='mt-4 pt-4 border-t border-[#2D2D52]'>
        <button
          className='w-full bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded-lg text-white font-medium text-sm'
          onClick={() => navigate(isOnCommunityPage ? '/' : '/community')}
        >
          {isOnCommunityPage ? '💬 Go to Chat' : '🌐 Go to Community'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
