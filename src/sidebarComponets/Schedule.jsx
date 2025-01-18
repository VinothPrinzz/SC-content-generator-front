import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Plus, LogOut, HomeIcon, FileText, GlassesIcon, 
    Grid2X2Icon, Edit2, Trash2, Eye, Share2, 
    Linkedin, Twitter, Instagram, Clock, X, Check, Copy
} from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

// Helper function moved outside components to be accessible by all
const getPlatformIcon = (platform) => {
  switch (platform?.[0]?.toLowerCase()) {
    case 'linkedin':
      return <Linkedin className="text-blue-600" size={20} />;
    case 'twitter':
      return <Twitter className="text-blue-400" size={20} />;
    case 'instagram':
      return <Instagram className="text-purple-600" size={20} />;
    default:
      return null;
  }
};

// View Modal Component
const ViewModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Post Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {getPlatformIcon(post.platform)}
              <span className="text-gray-600">
                Scheduled for {new Date(post.scheduledTime).toLocaleString()}
              </span>
            </div>
            
            <div>
              <h3 className="font-medium">Content</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            
            {post.caption && (
              <div>
                <h3 className="font-medium">Caption</h3>
                <p className="mt-1 text-gray-700">
                  {post.caption}
                </p>
              </div>
            )}
            
            {post.hashtags && (
              <div>
                <h3 className="font-medium">Hashtags</h3>
                <p className="mt-1 text-gray-700">
                  {post.hashtags}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Share Modal Component
const ShareModal = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/${post._id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Share Post</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <input 
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent outline-none"
              />
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-200"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Schedule = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "User", email: "" });
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [sharePost, setSharePost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Fetch user data
      const userResponse = await api.get('/api/v1/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(userResponse.data);

      // Fetch scheduled posts
      const postsResponse = await api.get('/api/v1/posts/schedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sort posts by scheduled date
      const sortedPosts = postsResponse.data.sort((a, b) => 
        new Date(a.scheduledTime) - new Date(b.scheduledTime)
      );
      
      setScheduledPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupPostsByDate = (posts) => {
    const groups = {};
    posts.forEach(post => {
      const date = new Date(post.scheduledTime);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: '2-digit'
      });
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(post);
    });
    return groups;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    navigate("/");
  };

  const handleShare = (post) => {
    setSharePost(post);
  };

  const handleView = (post) => {
    setViewPost(post);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const groupedPosts = groupPostsByDate(scheduledPosts);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return '';
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userData={userData} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNavbar setShowCreateModal={setShowCreateModal} />
        <div className="p-6">
          <h1 className="text-2xl font-semibold ">Schedule</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="text-red-600 p-4 rounded-lg bg-red-50">
              Error loading scheduled posts: {error}
            </div>
          ) : Object.keys(groupedPosts).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No scheduled posts</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPosts).map(([dateStr, posts]) => (
                <div key={dateStr} className="space-y-2">
                  <h2 className="text-lg font-medium text-gray-900">
                    {getDateLabel(dateStr)} | {dateStr}
                  </h2>
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-2">
                          <Clock size={18} className="text-gray-400" />
                          <span className="text-gray-600">
                            {formatTime(post.scheduledTime)}
                          </span>
                        </div>
                        <div className="flex-shrink-0">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 line-clamp-1">
                            {post.content || post.caption}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleView(post)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleShare(post)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {viewPost && (
        <ViewModal 
          post={viewPost} 
          onClose={() => setViewPost(null)} 
        />
      )}
      
      {sharePost && (
        <ShareModal 
          post={sharePost} 
          onClose={() => setSharePost(null)} 
        />
      )}
    </div>
  );
};

export default Schedule;