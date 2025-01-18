import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../api/axios';  // Update path according to your project structure

const CreatePostModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    platform: '',
    content: '',
    hashtags: '',
    caption: '',
    image: null,
    scheduledTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create FormData object for multipart form submission
      const formDataToSend = new FormData();
      formDataToSend.append('platform', formData.platform);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('hashtags', formData.hashtags);
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('scheduledTime', formData.scheduledTime);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post('/api/v1/posts/create', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        onClose();
        // Optionally refresh the posts list or show success message
        window.location.reload();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Create New Post</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Existing form fields remain exactly the same */}
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                ></textarea>
              </div>

              {/* Caption (for Instagram/Twitter) */}
              {(formData.platform === 'instagram' || formData.platform === 'twitter') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caption
                  </label>
                  <textarea
                    name="caption"
                    value={formData.caption}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  ></textarea>
                </div>
              )}

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="#example #post"
                />
              </div>

              {/* Image Upload (for Instagram/Twitter) */}
              {(formData.platform === 'instagram' || formData.platform === 'twitter') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload image
                      </span>
                    </label>
                    {formData.image && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {formData.image.name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;