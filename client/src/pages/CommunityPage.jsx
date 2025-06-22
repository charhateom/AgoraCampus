import React from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSideBar';
import CommunityFeed from '../components/CommunityFeed';
import { ChatContext } from '../context/ChatContext';
import { useContext } from 'react';

const CommunityPage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className='w-full h-screen bg-[#1A1A28]'>
      <div className={`h-full grid ${selectedUser ? 'md:grid-cols-[350px_1fr_300px]' : 'md:grid-cols-[350px_1fr]'}`}>
        <Sidebar />
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 py-2 text-white text-center border-b border-[#2D2D52] bg-[#1E1E2D] z-10 text-xl font-semibold">
            🌐 Community Feed
          </div>
          <div className="h-full pt-12">
            <CommunityFeed />
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
