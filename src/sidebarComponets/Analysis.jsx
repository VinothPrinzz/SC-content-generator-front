import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Activity, TrendingUp, BarChart3, RefreshCcw } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, change, bgColor = "bg-white" }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-sm border`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-purple-500" />
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      {change !== undefined && (
        <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
  </div>
);

const Analytics = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "User", email: "" });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const [userResponse, analyticsResponse] = await Promise.all([
        api.get('/api/v1/user', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        activeTab === 'twitter' 
          ? api.get('/api/v1/twitter/metrics', {
              headers: { Authorization: `Bearer ${token}` }
            })
          : api.get('/api/v1/posts/analytics', {
              headers: { Authorization: `Bearer ${token}` }
            })
      ]);

      setUserData(userResponse.data);
      setAnalyticsData(analyticsResponse.data);
    } catch (error) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userData={userData} />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              disabled={refreshing}
            >
              <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="mb-6 border-b">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('twitter')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'twitter'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Twitter
              </button>
            </nav>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Total Engagement"
                  value={analyticsData?.totalEngagement || 0}
                  icon={Activity}
                  change={15.6}
                />
                <MetricCard
                  title="Average Engagement"
                  value={analyticsData?.avgEngagement || 0}
                  icon={TrendingUp}
                  change={-2.3}
                />
                <MetricCard
                  title="Total Posts"
                  value={analyticsData?.totalPosts || 0}
                  icon={BarChart3}
                  change={8.1}
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-4">Engagement Timeline</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analyticsData?.timeline || []}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            // Twitter tab content remains the same
            <div className="space-y-6">
              {/* Twitter Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Followers"
                  value={analyticsData?.user?.public_metrics?.followers_count || 0}
                  icon={Activity}
                />
                <MetricCard
                  title="Following"
                  value={analyticsData?.user?.public_metrics?.following_count || 0}
                  icon={Activity}
                />
                <MetricCard
                  title="Tweet Count"
                  value={analyticsData?.user?.public_metrics?.tweet_count || 0}
                  icon={BarChart3}
                />
                <MetricCard
                  title="Listed Count"
                  value={analyticsData?.user?.public_metrics?.listed_count || 0}
                  icon={BarChart3}
                />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium mb-4">Recent Tweets Performance</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData?.tweets || []}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="created_at" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="public_metrics.like_count" 
                        name="Likes"
                        stroke="#f91880" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="public_metrics.retweet_count" 
                        name="Retweets"
                        stroke="#00ba7c" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;