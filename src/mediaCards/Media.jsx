import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../index.css";

const Media = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center">
      {/* Home Button */}
      <div className="absolute top-0 left-0 p-4">
        <button
          onClick={() => (window.location.href = "/home")}
          className=" bg-pink-400 bg-opacity-50 text-grey-800 py-2 px-4 rounded-lg flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          home
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LinkedIn Box */}
        <div
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300 h-80 flex flex-col justify-center items-center"
          onClick={() => handleNavigation("/media/linkden")}
        >
          <img
            src="path/to/linkedin-image.jpg" // Replace with your image path or URL
            alt="LinkedIn"
            className="w-16 h-16 mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-800">LinkedIn</h3>
          <p className="text-gray-600 mt-2 text-center">
            Create a post with an astonishing caption for LinkedIn
          </p>
        </div>

        {/* Instagram Box */}
        <div
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300 h-80 flex flex-col justify-center items-center"
          onClick={() => handleNavigation("/media/instagram")}
        >
          <img
            src="path/to/instagram-image.jpg" // Replace with your image path or URL
            alt="Instagram"
            className="w-16 h-16 mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-800">Instagram</h3>
          <p className="text-gray-600 mt-2 text-center">
            Create an Instagram Post from a few prompts
          </p>
        </div>

        {/* Twitter Box */}
        <div
          className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300 h-80 flex flex-col justify-center items-center"
          onClick={() => handleNavigation("/media/twitter")}
        >
          <img
            src="path/to/twitter-image.jpg" // Replace with your image path or URL
            alt="Twitter"
            className="w-16 h-16 mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-800">Twitter</h3>
          <p className="text-gray-600 mt-2 text-center">Tweet in Seconds!</p>
        </div>
      </div>
    </div>
  );
};

export default Media;
