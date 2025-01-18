import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from './api/axios';
import {
  Plus, LogOut, HomeIcon, FileText, GlassesIcon, 
  Grid2X2Icon, Edit2, Trash2
} from "lucide-react";
import CreatePostModal from './sidebarComponets/CreatePostModel';
import Sidebar from './components/Sidebar'; 
import TopNavbar from './components/TopNavbar';


const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "User",
    email: ""
  });
  const [queuedPosts, setQueuedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user data
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const userResponse = await api.get('/api/v1/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch queued posts
      const postsResponse = await api.get('/api/v1/posts/queue', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Queued Posts Response:', postsResponse.data);
      // Debug log for first post structure
      if (postsResponse.data.length > 0) {
        console.log('First post structure:', JSON.stringify(postsResponse.data[0], null, 2));
      }

      setUserData(userResponse.data);
      setQueuedPosts(postsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/v1/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueuedPosts(posts => posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      // You might want to add error handling UI here
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`); // This should match the route path in App.jsx
  };

  const renderPostContent = (post) => {
    const platform = Array.isArray(post.platform) && post.platform.length > 0 
      ? post.platform[0].toLowerCase() 
      : 'unknown';
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
  
    switch (platform) {
      case 'instagram':
        return (
          <div className="relative h-full flex flex-col">
            <div className="relative">
              <img 
                src={post.image || "/api/placeholder/400/300"} 
                alt={post.caption}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-purple-600">
                Instagram
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm line-clamp-3 flex-1 text-gray-700">{post.caption}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Scheduled for {formatDate(post.scheduledTime)}
                </p>
              </div>
            </div>
          </div>
        );
  
      case 'linkedin':
        return (
          <div className="relative h-full flex flex-col p-4">
            <div className="absolute top-3 right-3 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium text-blue-600">
              LinkedIn
            </div>
            <h3 className="font-medium text-lg mb-2 pr-20">{post.title || 'Untitled Post'}</h3>
            <p className="text-sm line-clamp-4 flex-1 text-gray-600">{post.content}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Scheduled for {formatDate(post.scheduledTime)}
              </p>
            </div>
          </div>
        );
  
      case 'twitter':
        return (
          <div className="relative h-full flex flex-col">
            {post.image ? (
              <div className="relative">
                <img 
                  src={post.image}
                  alt="Tweet media"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-blue-400">
                  Twitter
                </div>
              </div>
            ) : (
              <div className="h-12 relative">
                <div className="absolute top-3 left-3 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium text-blue-400">
                  Twitter
                </div>
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm line-clamp-3 flex-1 text-gray-700">{post.content}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Scheduled for {formatDate(post.scheduledTime)}
                </p>
              </div>
            </div>
          </div>
        );
  
      default:
        return (
          <div className="p-4">
            <h3 className="font-medium mb-2">{post.title || 'Untitled Post'}</h3>
            <p className="text-sm line-clamp-3">{post.content || 'No content'}</p>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar userData={userData} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
      <TopNavbar setShowCreateModal={setShowCreateModal} />
        
        {/* Queue Grid */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Queue</h1>
          
          {error ? (
            <div className="text-red-600 p-4 rounded-lg bg-red-50">
              Error loading posts: {error}
            </div>
          ) : queuedPosts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No posts in queue</p>
              <button
                className="mt-4 px-4 py-2 text-purple-600 hover:text-purple-700"
                onClick={() => navigate("/media")}
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {queuedPosts.map((post) => (
    <div
      key={post._id}
      className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setHoveredPost(post._id)}
      onMouseLeave={() => setHoveredPost(null)}
    >
      {renderPostContent(post)}
      
      {/* Hover Actions */}
      {hoveredPost === post._id && (
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => handleEditPost(post._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            <Edit2 size={16} className="text-gray-700" />
          </button>
          <button
            onClick={() => handleDeletePost(post._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      )}
    </div>
  ))}
</div>
          )}
        </div>
      </div>
      {showCreateModal && (
        <CreatePostModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
)}
    </div>
  );
};

export default Home;
