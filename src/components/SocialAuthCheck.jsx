import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialAuthModal from '../sidebarComponets/SocialAuthModel';
import api from '../api/axios';

const SocialAuthCheck = ({ platform, onClose }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSocialAuth();
  }, [platform]);

  const checkSocialAuth = async () => {
    try {
      setChecking(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }

      const response = await api.get(`/api/v1/social-accounts/check/${platform}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.isConnected) {
        navigate(`/media/${platform.toLowerCase()}`);
      } else {
        setShowAuthModal(true);
      }
    } catch (error) {
      setShowAuthModal(true);
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Checking {platform} connection...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Connect {platform} Account</h2>
            <p className="text-gray-600 mb-6">
              You need to connect your {platform} account before creating content.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Connect {platform}
              </button>
            </div>
          </div>
        </div>
      )}
      <SocialAuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          onClose();
        }}
        initialPlatform={platform}
      />
    </>
  );
};

export default SocialAuthCheck;