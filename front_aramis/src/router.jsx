import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Palette from "./pages/palette";
import StartCommande from "./pages/StartCommande";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/palette" element={<Palette />} />
      <Route path="/start" element={<StartCommande />} />
    </Routes>
  );
}