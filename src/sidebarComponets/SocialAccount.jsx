import React, { useState, useEffect } from 'react';
import { MoreVertical, Plus, Twitter, Linkedin, Instagram } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import SocialAuthModal from './SocialAuthModel';

// Add PlatformIcon component
const PlatformIcon = ({ platform }) => {
  switch (platform?.toLowerCase()) {
    case 'twitter':
      return <Twitter className="text-blue-400" size={20} />;
    case 'linkedin':
      return <Linkedin className="text-blue-700" size={20} />;
    case 'instagram':
      return <Instagram className="text-pink-600" size={20} />;
    default:
      return null;
  }
};

const SocialAccountCard = ({ id, platform, username, dateAdded, avatarUrl, onDisconnect }) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      const token = localStorage.getItem('token');
      await api.delete(`/api/v1/social-accounts/${platform}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDisconnect?.(id);
    } catch (error) {
      console.error('Error disconnecting account:', error);
    } finally {
      setIsDisconnecting(false);
      setShowDropdown(false);
    }
  };

  const formattedDate = new Date(dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 relative">
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect Account'}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={avatarUrl || `/api/placeholder/48/48`} 
            alt={username} 
            className="w-12 h-12 rounded-full bg-gray-100"
          />
          <div className="absolute -bottom-1 -right-1">
            <PlatformIcon platform={platform} />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{username}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>Added</span>
            <span className="mx-1">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialAccounts = () => {
  const [userData, setUserData] = useState({ username: "User", email: "" });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch user data
        const userResponse = await api.get('/api/v1/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(userResponse.data);

        // Fetch social accounts
        const accountsResponse = await api.get('/api/v1/social-accounts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccounts(accountsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDisconnect = (accountId) => {
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== accountId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar userData={userData} />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Social Accounts</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accounts.map((account) => (
              <SocialAccountCard 
                key={account.id} 
                {...account} 
                onDisconnect={handleDisconnect}
              />
            ))}
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full h-full min-h-[120px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Add Social</span>
            </button>
          </div>
        </div>
      </div>

      <SocialAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default SocialAccounts;