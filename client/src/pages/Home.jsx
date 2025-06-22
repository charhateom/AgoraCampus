
import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import RightSidebar from '../components/RightSideBar.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import CommunityFeed from '../components/CommunityFeed';

const Home = () => {
  const {selectedUser} = useContext(ChatContext);
  const [activeTab, setActiveTab] = useState('chat');
  return (
    <div className='w-full h-screen bg-[#1A1A28]'>
      <div className={`h-full grid ${selectedUser ? 'md:grid-cols-[350px_1fr_300px]' : 'md:grid-cols-[350px_1fr]'}`}>
        <Sidebar/>
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default Home