import React, { useState } from 'react';
import AppRouter from "./router";
import Navbar from "./components/Sidebar"; 
import { OrderProvider } from "./context/OrderContext";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <OrderProvider>
      {/* On utilise 'block' ou 'relative' pour s'assurer que rien n'est côte à côte */}
      <div className="relative w-screen h-screen bg-white overflow-hidden">
        
        {/* BOUTON MENU */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-6 right-8 z-[110] bg-[#870000] p-3 rounded-xl shadow-lg"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            {isSidebarOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>

        {/* SIDEBAR ET OVERLAY */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <Navbar closeSidebar={() => setIsSidebarOpen(false)} />
          </>
        )}

        {/* LE CONTENU PRINCIPAL - Doit être le SEUL élément de premier niveau ici */}
        <main className="w-full h-full overflow-auto">
          <AppRouter />
        </main>
        
      </div>
    </OrderProvider>
  );
}