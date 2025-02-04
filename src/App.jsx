import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginSignUp from "./LoginSignUp";
import Media from "./mediaCards/Media";
import Twitter from "./mediaCards/Twitter";
import Linkden from "./mediaCards/Linkden";
import Instagram from "./mediaCards/Instagram";
import Stats from "./sidebarComponets/Stats";
import EditPost from './EditPost'
import Schedule from "./sidebarComponets/Schedule";
import Analytics from "./sidebarComponets/Analysis";
import SocialAccounts from "./sidebarComponets/SocialAccount";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/media" element={<Media />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/media/linkden" element={<Linkden />} />
        <Route path="/media/instagram" element={<Instagram />} />
        <Route path="/media/twitter" element={<Twitter />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/social-accounts" element={<SocialAccounts />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
