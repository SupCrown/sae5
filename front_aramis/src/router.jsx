import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Palette from "./pages/palette";
import StartCommande from "./pages/StartCommande";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/auth" element={<Auth />} />

      {/* Routes protégées */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/palette" element={
        <ProtectedRoute>
          <Palette />
        </ProtectedRoute>
      } />
      
      <Route path="/start" element={
        <ProtectedRoute>
          <StartCommande />
        </ProtectedRoute>
      } />

      {/* Redirection automatique si la route n'existe pas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}