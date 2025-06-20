import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import {AuthContext} from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
const RightSideBar = () => {
  const {selectedUser,messages} = useContext(ChatContext);
  const {logout,onlineUsers} = useContext(AuthContext);
  const [msgImages , setMsgImages] = useState([]);
 
  // get all images from the messages and set them to state 

  useEffect(()=>{
    setMsgImages(
      messages.filter(msg=>msg.image).map(msg=>msg.image)
    )
  },[messages]);





  return selectedUser && (
    <div className={`bg-[#1E1E2D] text-white w-full h-full flex flex-col relative overflow-y-auto ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* User Profile Section */}
      <div className='pt-8 flex flex-col items-center gap-3 text-sm px-4'>
        <img 
          src={selectedUser?.profilePic || assets.avatar_icon} 
          alt="Profile" 
          className='w-24 h-24 rounded-full object-cover border-2 border-violet-500'
        />
        <h1 className='text-xl font-medium flex items-center gap-2'>
          {selectedUser.fullName}
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </h1>
        <p className='text-gray-400 text-center'>{selectedUser.bio}</p>
      </div>

      <hr className='border-[#2D2D52] my-4 mx-4'/>

      {/* Media Section */}
      <div className='px-4'>
        <p className='text-gray-400 uppercase text-xs font-medium mb-3'>Media</p>
        <div className='grid grid-cols-2 gap-2'>
          {msgImages.map((url, index) => (
            <div 
              key={index} 
              onClick={() => window.open(url)} 
              className='cursor-pointer rounded-lg overflow-hidden aspect-square'
            >
              <img 
                src={url} 
                alt="" 
                className='w-full h-full object-cover hover:scale-105 transition-transform duration-200'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className='mt-auto p-4'>
        <button onClick={()=>logout()} className='w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-medium py-2 px-4 rounded-full hover:opacity-90 transition-opacity'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default RightSideBar