// Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  HomeIcon,
  FileText,
  GlassesIcon,
  Grid2X2Icon,
} from 'lucide-react';

const Sidebar = ({ userData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 border-r bg-gray-50 p-6 flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center text-lg font-semibold">
          {userData.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-medium">{userData.username}'s Workspace</h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          <button
            onClick={() => navigate("/home")}
            className={`w-full flex items-center space-x-3 p-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/home") ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <HomeIcon size={22} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/schedule")}
            className={`w-full flex items-center space-x-3 p-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/schedule") ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <FileText size={22} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className={`w-full flex items-center space-x-3 p-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/analysis") ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <GlassesIcon size={22} />
            <span>Analysis</span>
          </button>
          <button
            onClick={() => navigate("/stats")}
            className={`w-full flex items-center space-x-3 p-3 text-gray-700 rounded-lg transition-colors ${
              isActive("/stats") ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Grid2X2Icon size={22} />
            <span>Stats</span>
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;