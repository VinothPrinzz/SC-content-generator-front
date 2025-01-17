import React, { useState } from "react";
import { ChevronLeft, Clock, Hash, Send } from "lucide-react";

const Instagram = () => {
  const [showOutput, setShowOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    industry: "",
    tone: "",
    contentTopic: "",
    keywords: "",
  });
  const [generatedContent, setGeneratedContent] = useState({
    caption: "",
    hashtags: "",
    bestTimeToPost: "",
    imageUrl: "",
  });

  const industries = [
    "Technology",
    "Fashion",
    "Food & Beverage",
    "Health & Wellness",
    "Travel",
    "Education",
  ];

  const tones = [
    "Professional",
    "Casual",
    "Humorous",
    "Inspirational",
    "Educational",
    "Promotional",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowOutput(false);

    try {
      const response = await fetch("http://localhost:3000/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      setGeneratedContent({
        caption: data.caption || "",
        hashtags: data.hashtags || "",
        bestTimeToPost: data.bestTimeToPost || "",
        imageUrl: data.imageUrl || "/api/placeholder/400/320",
      });

      setShowOutput(true);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
      console.error("Error generating content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <button
        onClick={() => (window.location.href = "/media")}
        className="bg-pink-400 bg-opacity-50 text-grey-800 py-2 px-4 rounded-lg flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            Instagram Post Generator
          </h1>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tone Adjustment
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">Select Tone</option>
                  {tones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Topic
                </label>
                <input
                  type="text"
                  name="contentTopic"
                  value={formData.contentTopic}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your content topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {error && (
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {showOutput && (
            <div className="mt-8 space-y-6 border-t pt-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Image Preview
                </label>
                <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
                  <img
                    src={generatedContent.imageUrl}
                    alt="Generated content preview"
                    className="rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Caption
                </label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  readOnly
                  value={generatedContent.caption}
                  placeholder="Generated caption will appear here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Hashtags
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  readOnly
                  value={generatedContent.hashtags}
                  placeholder="Generated hashtags will appear here"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Best Time to Post
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  readOnly
                  value={generatedContent.bestTimeToPost}
                  placeholder="Recommended posting time"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instagram;
