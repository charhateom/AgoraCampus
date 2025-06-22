import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
import { AuthContext } from "../context/AuthContext"; 
import assets from '../assets/assets';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePost = ({ onPostCreated }) => {
  const { axios: authAxios, authUser } = useContext(AuthContext); 
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Post cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageBase64;
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        imageBase64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }

      const response = await authAxios.post('/api/posts', {
        content,
        image: imageBase64
      },{
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }});

      if (response.data.success) {
        onPostCreated(response.data.post);
        setContent('');
        setImage(null);
        setImagePreview(null);
        toast.success('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#2D2D52] rounded-lg p-4 mb-4">
      <div className="flex gap-3 mb-4">
        <img
          src={authUser.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 bg-[#1E1E2D] text-white rounded-lg p-3 outline-none resize-none"
          rows={3}
        />
      </div>

      {imagePreview && (
        <div className="relative mb-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 w-full object-contain rounded-lg"
          />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <input
            type="file"
            id="post-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="post-image"
            className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer"
          >
            <img src={assets.gallery_icon} alt="Add image" className="w-5 h-5" />
            <span>Photo</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && !image)}
          className={`px-4 py-2 rounded-full ${isSubmitting || (!content.trim() && !image) ? 'bg-violet-800 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white`}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;