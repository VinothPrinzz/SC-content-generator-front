// TopNavbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2 } from 'lucide-react';

const TopNavbar = ({ setShowCreateModal }) => {
  const navigate = useNavigate();

  return (
    <div className="border-b p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Content Generator</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => navigate("/media")}
          >
            <Plus size={18} className="mr-2" />
            Create with AI
          </button>
          <button
            className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
            onClick={() => setShowCreateModal(true)}
          >
            <Edit2 size={18} className="mr-2" />
            Write Own
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;