
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import assets from '../assets/assets';
import toast from 'react-hot-toast';
import { formatMessageTime } from '../lib/utils';

const Post = ({ post, currentUser, onPostDeleted, onPostUpdated }) => {
  const { axios: authAxios } = useContext(AuthContext); // Use authAxios from context
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isAuthor = post.author._id === currentUser._id;
  const isLiked = post.likes.includes(currentUser._id);

  const handleLike = async () => {
    try {
      const response = await authAxios.put(`/api/posts/like/${post._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        onPostUpdated(response.data.post);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    setIsCommenting(true);
    try {
      const response = await authAxios.put(`/api/posts/comment/${post._id}`, {
        text: commentText
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        onPostUpdated(response.data.post);
        setCommentText('');
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      const response = await authAxios.delete(`/api/posts/${post._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        onPostDeleted(post._id);
        toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#2D2D52] rounded-lg p-4 mb-4">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.profilePic || assets.avatar_icon}
            alt={post.author.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-white">{post.author.fullName}</p>
            <p className="text-xs text-gray-400">
              {formatMessageTime(post.createdAt)}
            </p>
          </div>
        </div>
        
        {isAuthor && (
          <button
            onClick={handleDeletePost}
            disabled={isDeleting}
            className="text-gray-400 hover:text-white"
          >
            {isDeleting ? 'Deleting...' : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-white mb-3">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="max-h-96 w-full object-contain rounded-lg"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex justify-between items-center border-t border-[#3E3E5E] pt-3 mb-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? 'text-violet-400' : 'text-gray-400'} hover:text-violet-400`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-[#3E3E5E] pt-3">
          {/* Add Comment */}
          <div className="flex gap-3 mb-4">
            <img
              src={currentUser.profilePic || assets.avatar_icon}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-[#1E1E2D] text-white rounded-full px-4 py-2 outline-none"
              />
              <button
                onClick={handleAddComment}
                disabled={isCommenting || !commentText.trim()}
                className={`px-3 rounded-full ${isCommenting || !commentText.trim() ? 'bg-violet-800 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white`}
              >
                {isCommenting ? '...' : 'Post'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={comment.user.profilePic || assets.avatar_icon}
                    alt={comment.user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 bg-[#1E1E2D] rounded-lg p-3">
                    <p className="font-medium text-white">{comment.user.fullName}</p>
                    <p className="text-white text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatMessageTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;