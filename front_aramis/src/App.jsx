import React, { useState } from 'react';
import AppRouter from "./router";
import Navbar from "./components/Sidebar"; 
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fonction pour ouvrir/fermer le menu
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white relative">
      
      {/* BOUTON MENU TOGGLE */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-6 right-8 z-[110] bg-[#870000] p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {/* On change l'icône si le menu est ouvert */}
        {isSidebarOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Sidebar et Overlay */}
      {isSidebarOpen && (
        <>
          {/* L'overlay permet toujours de fermer en cliquant n'importe où ailleurs */}
          <div 
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
          <Navbar closeSidebar={() => setIsSidebarOpen(false)} />
        </>
      )}

      <main className="flex-1 h-full relative overflow-auto">
        <AppRouter />
      </main>
      
    </div>
  );
}