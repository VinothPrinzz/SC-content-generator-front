// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const generateRandomData = (points, baseValue) => {
//   return Array.from({ length: points }, (_, i) => ({
//     name: `Day ${i + 1}`,
//     value: Math.max(
//       0,
//       baseValue +
//         Math.floor(Math.random() * (baseValue * 0.4) - baseValue * 0.2)
//     ),
//   }));
// };

// const StatCard = ({ title, value, change, data }) => {
//   const isPositive = change > 0;

//   return (
//     <div className="bg-white rounded-lg shadow p-4 border">
//       <div className="mb-2">
//         <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//         <div className="flex items-baseline justify-between mt-1">
//           <span className="text-2xl font-bold">{value.toLocaleString()}</span>
//           <span
//             className={`text-sm ${
//               isPositive ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {isPositive ? "+" : ""}
//             {change.toFixed(2)}% vs previous period
//           </span>
//         </div>
//       </div>
//       <div className="h-24">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#10B981"
//               strokeWidth={2}
//               dot={false}
//             />
//             <XAxis hide={true} />
//             <YAxis hide={true} />
//             <Tooltip />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// const Stats = () => {
//   const stats = [
//     {
//       title: "FOLLOWERS",
//       value: 115177,
//       change: 30.04,
//       data: generateRandomData(30, 115177),
//     },
//     {
//       title: "ENGAGEMENTS",
//       value: 17978,
//       change: -19.54,
//       data: generateRandomData(30, 17978),
//     },
//     {
//       title: "POSTS",
//       value: 58,
//       change: -23.4,
//       data: generateRandomData(30, 58),
//     },
//     {
//       title: "COMMENTS",
//       value: 2555,
//       change: -47.72,
//       data: generateRandomData(30, 2555),
//     },
//     {
//       title: "IMPRESSIONS",
//       value: 3779146,
//       change: -26.88,
//       data: generateRandomData(30, 3779146),
//     },
//     {
//       title: "PROFILE VIEWS",
//       value: 83134,
//       change: 41.06,
//       data: generateRandomData(30, 83134),
//     },
//     {
//       title: "LIKES",
//       value: 15313,
//       change: -10.36,
//       data: generateRandomData(30, 15313),
//     },
//     {
//       title: "SHARES",
//       value: 110,
//       change: -70.59,
//       data: generateRandomData(30, 110),
//     },
//   ];

//   return (
//     <div className="flex-1 flex flex-col">
//       <div className="border-b p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-xl pt-3 font-semibold">My Stats</h1>
//           <div className="flex items-center space-x-4">
//             <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <StatCard
//               key={index}
//               title={stat.title}
//               value={stat.value}
//               change={stat.change}
//               data={stat.data}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Stats;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  GlassesIcon,
  Grid2X2Icon,
  HomeIcon,
  LogOut,
} from "lucide-react";

const generateRandomData = (points, baseValue) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.max(
      0,
      baseValue +
        Math.floor(Math.random() * (baseValue * 0.4) - baseValue * 0.2)
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
  const user = {
    name: localStorage.getItem("userName") || "User",
    photoUrl: localStorage.getItem("userPhoto") || "/api/placeholder/32/32",
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    navigate("/");
  };

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
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-200 text-gray-700 rounded-lg text-lg">
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
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl pt-3 font-semibold">My Stats</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
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
