import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Palette from "./pages/palette";
import StartCommande from "./pages/StartCommande";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { authService } from "./services/authService";
import { useState, useEffect } from "react";

// Pages Admin
import GestionEmpl from "./pages/Admin/GestionEmpl.jsx";
import ModifEmpl from "./pages/Admin/ModifEmpl.jsx";
import CreerEmpl from "./pages/Admin/CreerEmpl.jsx";
import GestionPrep from "./pages/Admin/GestionPrep.jsx";
import ModifPrep from "./pages/Admin/ModifPrep.jsx";
import CreerPrep from "./pages/Admin/CreerPrep.jsx";
import GestionCommd from "./pages/Admin/GestionCommd.jsx";
import InfosCommd from "./pages/Admin/InfosCommd.jsx";
import CreerCommd from "./pages/Admin/CreerCommd.jsx";
import GestionStocks from "./pages/Admin/GestionStocks.jsx";
import CreerStocks from "./pages/Admin/CreerStocks.jsx";
import InfosStocks from "./pages/Admin/InfosStocks.jsx";
import CreerCli from "./pages/Admin/CreerCli.jsx"
import GestionCli from "./pages/Admin/GestionCli.jsx"
import Stat from "./pages/Admin/Stat.jsx";
import Listen from "./pages/ListenPage.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/auth" element={<Auth />} />

      {/* Routes Utilisateurs & Prép (Communes) */}
      {/* 2. Route Racine : Redirige vers Palette SI connecté, sinon vers Auth via ProtectedRoute */}
      <Route path="/" element={<ProtectedRoute><Navigate to="/palette" replace /></ProtectedRoute>} />
      <Route path="/palette" element={<ProtectedRoute><Palette /></ProtectedRoute>} />
      <Route path="/start" element={<ProtectedRoute><StartCommande /></ProtectedRoute>} />
      <Route path="/listen" element={<ProtectedRoute><Listen /></ProtectedRoute>} />

      {/* Routes Administration (Protégées par AdminRoute) */}
      <Route path="/gestion-prep" element={<AdminRoute><GestionPrep /></AdminRoute>} />
      <Route path="/modif-prep/:id" element={<AdminRoute><ModifPrep /></AdminRoute>} />
      <Route path="/creer-prep" element={<AdminRoute><CreerPrep /></AdminRoute>} />

      <Route path="/gestion-empl" element={<AdminRoute><GestionEmpl /></AdminRoute>} />
      <Route path="/modif-empl/:id" element={<AdminRoute><ModifEmpl /></AdminRoute>} />
      <Route path="/creer-empl" element={<AdminRoute><CreerEmpl /></AdminRoute>} />

      <Route path="/gestion-commd" element={<AdminRoute><GestionCommd /></AdminRoute>} />
      <Route path="/infos-commd/:id" element={<AdminRoute><InfosCommd /></AdminRoute>} />
      <Route path="/creer-commd" element={<AdminRoute><CreerCommd /></AdminRoute>} />

      <Route path="/gestion-stocks" element={<AdminRoute><GestionStocks /></AdminRoute>} />
      <Route path="/creer-stocks" element={<AdminRoute><CreerStocks /></AdminRoute>} />
      <Route path="/infos-stocks/:id" element={<AdminRoute><InfosStocks /></AdminRoute>} />

      <Route path="/gestion-cli" element={<AdminRoute><GestionCli /></AdminRoute>} />
      <Route path="/creer-cli" element={<AdminRoute><CreerCli /></AdminRoute>} />

      <Route path="/stat" element={<AdminRoute><Stat /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}