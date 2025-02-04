import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, MessageCircle, Repeat, Heart } from 'lucide-react';
import api from '../api/axios';

const MetricCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </span>
    </div>
    <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
  </div>
);

const TwitterMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTwitterMetrics();
  }, []);

  const fetchTwitterMetrics = async () => {
    try {
      const response = await api.get('/api/v1/twitter/metrics');
      const { user, tweets } = response.data;
      
      const avgEngagement = tweets.reduce((acc, tweet) => {
        const metrics = tweet.public_metrics;
        return acc + metrics.like_count + metrics.retweet_count + metrics.reply_count;
      }, 0) / tweets.length;

      setMetrics({
        followers: user.public_metrics.followers_count,
        following: user.public_metrics.following_count,
        tweets: tweets.length,
        avgEngagement,
        recentTweets: tweets.slice(0, 5),
        engagementData: tweets.map(tweet => ({
          date: new Date(tweet.created_at).toLocaleDateString(),
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count
        }))
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Twitter metrics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Followers"
          value={metrics.followers}
          change={2.5}
          icon={Users}
        />
        <MetricCard
          title="Average Likes"
          value={Math.round(metrics.avgEngagement)}
          change={1.8}
          icon={Heart}
        />
        <MetricCard
          title="Total Tweets"
          value={metrics.tweets}
          change={-0.5}
          icon={MessageCircle}
        />
        <MetricCard
          title="Following"
          value={metrics.following}
          change={3.2}
          icon={Activity}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Engagement Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="likes" stroke="#f91880" />
              <Line type="monotone" dataKey="retweets" stroke="#00ba7c" />
              <Line type="monotone" dataKey="replies" stroke="#1d9bf0" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Recent Tweets</h3>
        <div className="space-y-4">
          {metrics.recentTweets.map(tweet => (
            <div key={tweet.id} className="border-b pb-4 last:border-0">
              <p className="text-gray-800 mb-2">{tweet.text}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {tweet.public_metrics.like_count}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat className="w-4 h-4" />
                  {tweet.public_metrics.retweet_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {tweet.public_metrics.reply_count}
                </span>
                <span>{new Date(tweet.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwitterMetrics;