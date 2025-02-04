import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Plus, LogOut, Calendar, FileText, GlassesIcon, 
  Grid2X2Icon, Edit2, Trash2, Clock, X, Check,
  Users
} from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { format } from 'date-fns';

const RescheduleModal = ({ post, onClose, onReschedule }) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      setError("Please select both date and time");
      return;
    }

    try {
      const newSchedule = new Date(`${newDate}T${newTime}`);
      if (newSchedule < new Date()) {
        setError("Cannot schedule for past date/time");
        return;
      }

      await onReschedule(post._id, newSchedule.toISOString());
    } catch(error) {
      setError("Failed to reschedule post");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Reschedule Post</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">New Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reschedule
              </button>
            </div>
          </form>
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const [userResponse, postsResponse] = await Promise.all([
        api.get('/api/v1/user', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/api/v1/posts/schedule', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUserData(userResponse.data);
      setScheduledPosts(postsResponse.data.sort((a, b) => 
        new Date(a.scheduledTime) - new Date(b.scheduledTime)
      ));
    } catch (error) {
      setError('Failed to load scheduled posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReschedule = async (postId, newDateTime) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/v1/posts/schedule/${postId}`, {
        scheduledTime: newDateTime,
        schedule: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchData();
      setShowRescheduleModal(false);
    } catch (error) {
      setError('Failed to reschedule post');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this scheduled post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/v1/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScheduledPosts(posts => posts.filter(post => post._id !== postId));
    } catch (error) {
      setError('Failed to delete post');
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar userData={userData} />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Scheduled Posts</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {scheduledPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new post</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/media")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Render scheduled posts */}
              {scheduledPosts.map((post) => (
                <div key={post._id} className={`bg-white p-4 rounded-lg shadow-sm border border-l-4 ${
                  post.posted ? 'border-l-green-400' : 'border-l-yellow-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {post.posted ? 'Posted on ' : 'Scheduled for '}
                        {format(new Date(post.scheduledTime), 'MMM dd, yyyy hh:mm a')}
                      </p>
                      {post.posted ? (
                        <span className="text-sm text-green-600 flex items-center mt-1">
                          <Check size={16} className="mr-1" /> Posted
                        </span>
                      ) : post.postError ? (
                        <span className="text-sm text-red-600 flex items-center mt-1">
                          <X size={16} className="mr-1" /> Failed: {post.postError}
                        </span>
                      ) : null}
                    </div>

                    {!post.posted && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setShowRescheduleModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-gray-600">
                    <p className="line-clamp-2">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRescheduleModal && selectedPost && (
        <RescheduleModal
          post={selectedPost}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedPost(null);
          }}
          onReschedule={handleReschedule}
        />
      )}
    </div>
  );
};

export default Schedule;