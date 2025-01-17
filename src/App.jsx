import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginSignUp from "./LoginSignUp";
import Media from "./mediaCards/Media";
import Twitter from "./mediaCards/Twitter";
import Linkden from "./mediaCards/Linkden";
import Instagram from "./mediaCards/Instagram";
import Stats from "./sidebarComponets/Stats";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route path="/media/linkden" element={<Linkden />} />
        <Route path="/media/instagram" element={<Instagram />} />
        <Route path="/media/twitter" element={<Twitter />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
