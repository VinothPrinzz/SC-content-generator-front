import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from './api/axios';

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState({
    content: '',
    caption: '',
    hashtags: '',
    scheduledTime: ''
  });

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      console.log('Fetching post with ID:', postId);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await api.get(`/api/v1/posts/queue/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Transform the response data to match our form structure
      const postData = response.data;
      setPost({
        content: postData.content || '',
        caption: postData.caption || '',
        hashtags: postData.hashtags || '',
        scheduledTime: postData.scheduledTime || ''
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Failed to fetch post'}`);
      } else if (error.request) {
        setError('No response received from server');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/v1/posts/queue/${postId}`, post, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/home');
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-semibold">Edit Post</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your post content..."
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              name="caption"
              value={post.caption}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter caption..."
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtags
            </label>
            <input
              type="text"
              name="hashtags"
              value={post.hashtags}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter hashtags (e.g., #nature #photography)"
            />
          </div>

          {/* Scheduled Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={post.scheduledTime ? new Date(post.scheduledTime).toISOString().slice(0, 16) : ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;