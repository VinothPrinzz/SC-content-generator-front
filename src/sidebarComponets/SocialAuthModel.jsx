import React from 'react';
import { X, Twitter, Linkedin, Instagram, ChevronRight } from 'lucide-react';

const SocialAuthModal = ({ isOpen, onClose }) => {
  const handleTwitterAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `http://localhost:3000/api/v1/auth/twitter?token=${token}`;
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Connect Social Account</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTwitterAuth}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Twitter className="text-blue-400" />
              <span>Connect with Twitter</span>
            </div>
            <ChevronRight className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthModal;