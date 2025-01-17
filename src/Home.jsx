import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Clock,
  Star,
  Grid,
  List,
  Settings,
  Share,
  Globe,
  Image,
  FileText,
  Folder,
  Box,
  Palette,
  Type,
  Trash2,
  HelpCircle,
  GlassesIcon,
  GitGraphIcon,
  GitGraph,
  Grid2X2Icon,
  LogOut,
  HomeIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");

  // You would typically get this from your auth context or state management
  const user = {
    name: localStorage.getItem("userName") || "User",
    photoUrl: localStorage.getItem("userPhoto") || "/api/placeholder/32/32",
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    // Navigate to login page
    navigate("/");
  };

  const handleCreatePost = () => {
    navigate("/media");
  };

  const queues = [
    {
      id: 1,
      title: "Untitled",
      preview: "/api/placeholder/400/300",
      lastViewed: "18 hours ago",
    },
    {
      id: 2,
      title: "AI-Powered Adaptive Travel Assistant",
      preview: "/api/placeholder/400/300",
      lastViewed: "18 hours ago",
    },
    {
      id: 3,
      title: "The Future of Innovation",
      preview: "/api/placeholder/400/300",
      lastViewed: "18 hours ago",
    },
    {
      id: 4,
      title: "Intelligent Product Comparison",
      preview: "/api/placeholder/400/300",
      lastViewed: "4 months ago",
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-72 border-r bg-gray-50 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt="Profile"
              className="w-10 h-10 rounded-lg bg-purple-200"
            />
          ) : (
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center text-lg font-semibold">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-medium">{user.name}'s Workspace</h2>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/home")}
              className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg text-lg"
            >
              <HomeIcon size={22} />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg text-lg">
              <FileText size={22} />
              <span>Schedule</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg text-lg">
              <GlassesIcon size={22} />
              <span>Analysis</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg text-lg"
              onClick={() => navigate("/stats")}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl pt-3 font-semibold">Content Generator</h1>
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg"
                onClick={handleCreatePost}
              >
                <Plus size={18} className="mr-2" />
                Create new
              </button>
            </div>
          </div>
        </div>

        {/* Queue Grid */}
        <h1 className="text-2xl font-semibold px-6 pt-3">Queue</h1>
        <div className="p-6 grid grid-cols-3 gap-6">
          {queues.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={project.preview}
                alt={project.title}
                className="w-full h-48 object-cover bg-gray-100"
              />
              <div className="p-4">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">
                  Last viewed {project.lastViewed}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
