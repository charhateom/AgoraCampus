import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const {authUser , updateProfile} = useContext(AuthContext);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName:name , bio});
      navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image,fullName:name,bio});
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-80 backdrop-blur-lg text-gray-100 border border-gray-700 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 bg-gray-700 flex flex-col items-center justify-center p-8">
          <div className="relative mb-6 group">
            <img 
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-600 group-hover:border-violet-500 transition-all duration-300"
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} 
              alt="Profile" 
            />
            

            <label 
              htmlFor="avatar"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <span className="text-white text-sm font-medium">Change</span>
            </label>
          </div>
          <h2 className="text-xl font-bold text-center mt-4">{name}</h2>
          <p className="text-gray-400 text-center mt-2">{bio}</p>
        </div>

        {/* Form Section */}
        <div className="md:w-2/3 p-8">
          <h1 className="text-2xl font-bold mb-6 text-violet-400">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="file" 
                id="avatar"
                onChange={(e) => setSelectedImage(e.target.files[0])} 
                accept=".png, .jpg, .jpeg" 
                className="hidden" 
              />
              <label 
                htmlFor="avatar" 
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="avatar"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium"
                >
                  Choose Image
                </label>
                <span className="text-sm text-gray-400">
                  {selectedImage ? selectedImage.name : "No image selected"}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
          <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage&&'rounded-full'}`} src={authUser?.profilePic||assets.logo_icon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;