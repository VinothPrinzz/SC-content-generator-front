import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, TrendingUp, BarChart3 } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CreatePostModal from '../sidebarComponets/CreatePostModel';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const Analytics = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "User",
    email: ""
  });
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('likes');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUserDataAndAnalytics();
  }, []);

  const fetchUserDataAndAnalytics = async () => {
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

      // Fetch analytics data
      const analyticsResponse = await api.get('/api/v1/posts/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(analyticsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setLoading(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const calculateTotalEngagement = () => {
    if (!analyticsData || analyticsData.length === 0) return 0;
    return analyticsData.reduce((total, post) => {
      return total + 
        (post.likes || 0) + 
        (post.shares || 0) + 
        (post.comments || 0);
    }, 0);
  };

  const calculateAverageEngagement = () => {
    if (!analyticsData || analyticsData.length === 0) return 0.00;
    const total = calculateTotalEngagement();
    return total / analyticsData.length;
  };

  const getTimelineData = () => {
    if (!analyticsData) return [];
    return analyticsData.map(post => ({
      date: new Date(post.createdAt).toLocaleDateString(),
      likes: post.likes || 0,
      shares: post.shares || 0,
      comments: post.comments || 0,
      impressions: post.impressions || 0
    }));
  };

  const getPieChartData = () => {
    if (!analyticsData || analyticsData.length === 0) return [];
    const totals = analyticsData.reduce((acc, post) => ({
      likes: acc.likes + (post.likes || 0),
      shares: acc.shares + (post.shares || 0),
      comments: acc.comments + (post.comments || 0),
      impressions: acc.impressions + (post.impressions || 0)
    }), { likes: 0, shares: 0, comments: 0, impressions: 0 });

    return Object.entries(totals).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userData={userData} />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar setShowCreateModal={setShowCreateModal} />

        <div className="p-6 space-y-6">
          {error ? (
            <div className="text-red-600 p-4 rounded-lg bg-red-50">
              Error loading analytics: {error}
            </div>
          ) : (
            <>
              {/* Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-800">Total Engagement</h3>
                    <Activity className="text-purple-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{calculateTotalEngagement()}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-800">Average Engagement</h3>
                    <TrendingUp className="text-purple-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{calculateAverageEngagement().toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-800">Total Posts</h3>
                    <BarChart3 className="text-purple-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{analyticsData.length}</p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-base font-medium text-gray-800 mb-4">Engagement Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Engagement Timeline */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-base font-medium text-gray-800 mb-4">Engagement Timeline</h3>
                  <div className="flex gap-2 mb-4">
                    {['likes', 'shares', 'comments', 'impressions'].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => setActiveMetric(metric)}
                        className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                          activeMetric === metric
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getTimelineData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={activeMetric}
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
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

export default Analytics;