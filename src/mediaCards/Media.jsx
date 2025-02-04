import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import SocialAuthCheck from "../components/SocialAuthCheck";
import api from '../api/axios'
import "../index.css";

const Media = () => {
  const [checkingPlatform, setCheckingPlatform] = useState(null);
  const navigate = useNavigate();

  const handlePlatformClick = async (platform) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/v1/social-accounts/check/${platform}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.isConnected) {
        navigate(`/media/${platform.toLowerCase()}`);
      } else {
        setCheckingPlatform(platform);
      }
    } catch (error) {
      setCheckingPlatform(platform);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="absolute top-4 left-4">
        <button 
          onClick={() => window.location.href = "/home"}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto pt-16">
        <h1 className="text-4xl font-semibold text-gray-800 text-center mb-3">Create posts with AI</h1>
        <p className="text-xl text-gray-600 text-center mb-16">Choose your platform to work with AI</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LinkedIn Card */}
          <div 
            onClick={() => handlePlatformClick('LinkedIn')}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-48 mb-4 bg-pink-50 rounded-lg flex items-center justify-center">
              <div className="space-y-3 opacity-50">
                <div className="w-32 h-1.5 bg-pink-200 rounded-full"></div>
                <div className="w-40 h-1.5 bg-pink-200 rounded-full"></div>
                <div className="w-28 h-1.5 bg-pink-200 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">LinkedIn</h3>
            <p className="text-gray-500 text-base mb-2">Create a post with an astonishing caption for LinkedIn</p>
            <div className="h-10 relative">
              <div className="absolute left-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center text-pink-500 hover:text-pink-600 font-medium text-lg">
                  Continue <ChevronRight className="w-6 h-6 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Instagram Card */}
          <div 
            onClick={() => handlePlatformClick('Instagram')}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-48 mb-4 bg-purple-50 rounded-lg flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-8 bg-purple-200 rounded-lg opacity-50"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-200 rounded-full opacity-30"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Instagram</h3>
            <p className="text-gray-500 text-base mb-2">Create an Instagram Post from a few prompts</p>
            <div className="h-10 relative">
              <div className="absolute left-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center text-pink-500 hover:text-pink-600 font-medium text-lg">
                  Continue <ChevronRight className="w-6 h-6 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Twitter Card */}
          <div 
            onClick={() => handlePlatformClick('Twitter')}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="h-48 mb-4 bg-purple-50 rounded-lg flex items-center justify-center">
              <div className="space-y-3 opacity-50">
                <div className="w-24 h-5 bg-purple-200 rounded"></div>
                <div className="w-32 h-5 bg-purple-200 rounded"></div>
                <div className="w-28 h-5 bg-purple-200 rounded"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Twitter</h3>
            <p className="text-gray-500 text-base mb-2">Tweet in Seconds!</p>
            <div className="h-10 relative">
              <div className="absolute left-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center text-pink-500 hover:text-pink-600 font-medium text-lg">
                  Continue <ChevronRight className="w-6 h-6 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {checkingPlatform && (
        <SocialAuthCheck 
          platform={checkingPlatform}
          onClose={() => setCheckingPlatform(null)}
        />
      )}
    </div>
  );
};

export default Media;