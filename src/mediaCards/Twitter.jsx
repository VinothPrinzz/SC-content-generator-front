import React, { useState } from "react";
import { ChevronLeft, Clock, Hash, Send, X, ChevronDown, Calendar } from "lucide-react";
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ScheduleModal = ({ isOpen, onClose, onSchedule, postId }) => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!scheduleDate || !scheduleTime) {
        setError("Please select both date and time");
        return;
      }

      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      if (scheduledDateTime < new Date()) {
        setError("Cannot schedule for a past date/time");
        return;
      }

      await onSchedule(postId, scheduledDateTime.toISOString());
      onClose();
    } catch (error) {
      setError("Failed to schedule post");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Schedule Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

const Twitter = () => {
  const navigate = useNavigate();
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [industryInput, setIndustryInput] = useState("");
  const [toneInput, setToneInput] = useState("");
  const [postId, setPostId] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isToneOpen, setIsToneOpen] = useState(false);
  
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedTones, setSelectedTones] = useState([]);

  const [formData, setFormData] = useState({
    platform: "Twitter",
    contentTopic: "",
    keywords: "",
  });

  const [generatedContent, setGeneratedContent] = useState({
    caption: "",
    hashtags: "",
    bestTimeToPost: "",
    imageUrl: "",
  });

  const industries = [
    "Technology", "Fashion", "Food & Beverage", "Health & Wellness",
    "Travel", "Education", "Other"
  ];

  const tones = [
    "Professional", "Casual", "Humorous", "Inspirational",
    "Educational", "Promotional", "Other"
  ];

  const handleAddTag = (value, type) => {
    if (!value.trim()) return;
    
    if (type === 'industry' && !selectedIndustries.includes(value.trim())) {
      setSelectedIndustries([...selectedIndustries, value.trim()]);
      setIndustryInput("");
      setIsIndustryOpen(false);
    } else if (!selectedTones.includes(value.trim())) {
      setSelectedTones([...selectedTones, value.trim()]);
      setToneInput("");
      setIsToneOpen(false);
    }
  };

  const removeTag = (tag, type) => {
    if (type === 'industry') {
      setSelectedIndustries(selectedIndustries.filter(i => i !== tag));
    } else {
      setSelectedTones(selectedTones.filter(t => t !== tag));
    }
  };

  const handleOptionSelect = (option, type) => {
    if (option === "Other") {
      if (type === 'industry') {
        setIsIndustryOpen(true);
        setIndustryInput("");
      } else {
        setIsToneOpen(true);
        setToneInput("");
      }
      return;
    }
    handleAddTag(option, type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowOutput(false);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login to continue");
        return;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id;

      const keywordsArray = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
  
      const response = await api.post(`/api/v1/posts/generate/${userId}`, {
        ...formData,
        industry: selectedIndustries,
        tone: selectedTones,
        keywords: keywordsArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const { post, suggestedPostingTime } = response.data;
      setPostId(post._id);
      
      setGeneratedContent({
        caption: post.caption || "",
        hashtags: post.hashtags || "",
        bestTimeToPost: suggestedPostingTime || "",
        imageUrl: post.image || "/api/placeholder/400/320",
      });
  
      setShowOutput(true);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQueue = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/v1/posts/queue/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/media');
    } catch (err) {
      setError("Failed to queue post");
    }
  };

  const handleSchedule = async (postId, dateTime) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/v1/posts/schedule/${postId}`, {
        scheduledTime: dateTime,
        schedule: true
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/media');
    } catch (err) {
      throw new Error("Failed to schedule post");
    }
  };
  
  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <button
        onClick={() => navigate('/media')}
        className="bg-pink-400 bg-opacity-50 text-grey-800 py-2 px-4 rounded-lg flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Twitter Post Generator</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Industry</label>
            <div className="relative">
              {isIndustryOpen ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={industryInput}
                    onChange={(e) => setIndustryInput(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Enter custom industry"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(industryInput, 'industry')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    onChange={(e) => handleOptionSelect(e.target.value, 'industry')}
                    className="w-full p-2 border rounded-md bg-white appearance-none"
                    value=""
                  >
                    <option value="">Select Industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedIndustries.map((industry) => (
                <span
                  key={industry}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeTag(industry, 'industry')}
                    className="hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tone</label>
            <div className="relative">
              {isToneOpen ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={toneInput}
                    onChange={(e) => setToneInput(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Enter custom tone"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(toneInput, 'tone')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    onChange={(e) => handleOptionSelect(e.target.value, 'tone')}
                    className="w-full p-2 border rounded-md bg-white appearance-none"
                    value=""
                  >
                    <option value="">Select Tone</option>
                    {tones.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTones.map((tone) => (
                <span
                  key={tone}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {tone}
                  <button
                    type="button"
                    onClick={() => removeTag(tone, 'tone')}
                    className="hover:text-green-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content Topic</label>
              <input
                type="text"
                name="contentTopic"
                value={formData.contentTopic}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your content topic"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Keywords (comma separated)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="keyword1, keyword2, keyword3"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedIndustries.length || !selectedTones.length}
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
              (loading || !selectedIndustries.length || !selectedTones.length) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Send className="w-4 h-4" />
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-md mt-6">
          {error}
        </div>
      )}

      {showOutput && (
        <div className="mt-8 space-y-6 border-t pt-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              Image Preview
            </label>
            <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
              <img
                src={generatedContent.imageUrl}
                alt="Generated content preview"
                className="rounded-md max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Caption
            </label>
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              readOnly
              value={generatedContent.caption}
              placeholder="Generated caption will appear here"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hashtags
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              readOnly
              value={generatedContent.hashtags}
              placeholder="Generated hashtags will appear here"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Best Time to Post
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              readOnly
              value={generatedContent.bestTimeToPost}
              placeholder="Recommended posting time"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleQueue}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Queue Post
            </button>
            
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Post
            </button>
          </div>
        </div>
      )}

      <ScheduleModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedule}
        postId={postId}
      />
    </div>
  </div>
);
};

export default Twitter;
