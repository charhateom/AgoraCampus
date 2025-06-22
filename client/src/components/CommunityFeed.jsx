
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import assets from '../assets/assets';
import Post from './Post';
import CreatePost from './CreatePost';

const CommunityFeed = () => {
  const { authUser, axios: authAxios } = useContext(AuthContext); // Use authAxios from context
  const { selectedUser, setSelectedUser } = useContext(ChatContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await authAxios.get('/api/posts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authAxios]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <div className="h-full flex flex-col bg-[#1A1A28]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#2D2D52] bg-[#1E1E2D]">
        <h2 className="text-white font-medium">Community Feed</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <img src={assets.logo_icon} alt="No posts" className="w-16 h-16 mb-4" />
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post 
              key={post._id} 
              post={post} 
              currentUser={authUser} 
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;