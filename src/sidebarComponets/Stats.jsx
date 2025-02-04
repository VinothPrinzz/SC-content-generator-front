import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from '../api/axios';
import Sidebar from "../components/Sidebar";
import TopNavbar from '../components/TopNavbar';

const generateRandomData = (points, baseValue) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.max(
      0,
      baseValue + Math.floor(Math.random() * (baseValue * 0.4) - baseValue * 0.2)
    ),
  }));
};

const StatCard = ({ title, value, change, data }) => {
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold">{value.toLocaleString()}</span>
          <span
            className={`text-sm ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}% vs previous period
          </span>
        </div>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <XAxis hide={true} />
            <YAxis hide={true} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Stats = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "User",
    email: ""
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const userResponse = await api.get('/api/v1/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(userResponse.data);
    } catch (error) {
      setError('Failed to load user data');
      if (error.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const stats = [
    {
      title: "FOLLOWERS",
      value: 115177,
      change: 30.04,
      data: generateRandomData(30, 115177),
    },
    {
      title: "ENGAGEMENTS",
      value: 17978,
      change: -19.54,
      data: generateRandomData(30, 17978),
    },
    {
      title: "POSTS",
      value: 58,
      change: -23.4,
      data: generateRandomData(30, 58),
    },
    {
      title: "COMMENTS",
      value: 2555,
      change: -47.72,
      data: generateRandomData(30, 2555),
    },
    {
      title: "IMPRESSIONS",
      value: 3779146,
      change: -26.88,
      data: generateRandomData(30, 3779146),
    },
    {
      title: "PROFILE VIEWS",
      value: 83134,
      change: 41.06,
      data: generateRandomData(30, 83134),
    },
    {
      title: "LIKES",
      value: 15313,
      change: -10.36,
      data: generateRandomData(30, 15313),
    },
    {
      title: "SHARES",
      value: 110,
      change: -70.59,
      data: generateRandomData(30, 110),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userData={userData} />
      <div className="flex-1 flex flex-col">
        <TopNavbar setShowCreateModal={setShowCreateModal} />
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl pt-3 font-semibold">My Stats</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchUserData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                data={stat.data}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;