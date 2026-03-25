import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Palette from "./pages/palette";
import StartCommande from "./pages/StartCommande";
import { ProtectedRoute } from "./components/ProtectedRoute";
import GestionEmpl from "./pages/Admin/GestionEmpl.jsx";
import ModifEmpl from "./pages/Admin/ModifEmpl.jsx";
import CreerEmpl from "./pages/Admin/CreerEmpl.jsx";
import GestionPrep from "./pages/Admin/GestionPrep.jsx";
import ModifPrep from "./pages/Admin/ModifPrep.jsx";
import CreerPrep from "./pages/Admin/CreerPrep.jsx";
import GestionCommd from "./pages/Admin/GestionCommd.jsx";
import ModifCommd from "./pages/Admin/ModifCommd.jsx";
import CreerCommd from "./pages/Admin/CreerCommd.jsx";
import GestionStocks from "./pages/Admin/GestionStocks.jsx";
import CreerStocks from "./pages/Admin/CreerStocks.jsx";
import InfosStocks from "./pages/Admin/InfosStocks.jsx";
import Stat from "./pages/Admin/Stat.jsx";
import Listen from "./pages/ListenPage.jsx";


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


           <Route path="gestion-prep" element={
       <ProtectedRoute>
         <GestionPrep />
       </ProtectedRoute>
     } />


     <Route path="modif-prep/:id" element={
       <ProtectedRoute>
         <ModifPrep />
       </ProtectedRoute>
     } />


     <Route path="creer-prep" element={
       <ProtectedRoute>
         <CreerPrep />
       </ProtectedRoute>
     } />


     <Route path="gestion-empl" element={
       <ProtectedRoute>
         <GestionEmpl />
       </ProtectedRoute>
     } />


     <Route path="modif-empl/:id" element={
       <ProtectedRoute>
         <ModifEmpl />
       </ProtectedRoute>
     } />


     <Route path="creer-empl" element={
       <ProtectedRoute>
         <CreerEmpl />
       </ProtectedRoute>
     } />


     <Route path="gestion-commd" element={
       <ProtectedRoute>
         <GestionCommd />
       </ProtectedRoute>
     } />


     <Route path="modif-commd/:id" element={
       <ProtectedRoute>
         <ModifCommd />
       </ProtectedRoute>
     } />


     <Route path="creer-commd" element={
       <ProtectedRoute>
         <CreerCommd />
       </ProtectedRoute>
     } />
    
     <Route path="gestion-stocks" element={
       <ProtectedRoute>
         <GestionStocks />
       </ProtectedRoute>
     } />


     <Route path="creer-stocks" element={
       <ProtectedRoute>
         <CreerStocks />
       </ProtectedRoute>
     } />


     <Route path="infos-stocks/:id" element={
       <ProtectedRoute>
         <InfosStocks />
       </ProtectedRoute>
     } />


     <Route path="stat" element={
       <ProtectedRoute>
         <Stat />
       </ProtectedRoute>
     } />


     <Route path="listen" element={
       <ProtectedRoute>
         <Listen />
       </ProtectedRoute>
     } />


     {/* Redirection automatique si la route n'existe pas */}
     <Route path="*" element={<Navigate to="/" replace />} />
   </Routes>
 );
}





