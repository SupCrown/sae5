import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home";
import StartCommande from "./pages/StartCommande";
import RecupCommande from "./pages/RecupCommande";
import DataLoading from "./pages/DataLoading";

export default function App() {
  return (
<<<<<<< HEAD
    <div
    >
      {/* Header */}
      <header
        style={{
          padding: "16px",
          borderBottom: "10px solid #AD211B", 
          textAlign: "center",
        }}
      >
=======
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / test Tailwind */}
      <div className="p-6 text-center">
      </div>
>>>>>>> c5951db697601e6dd7193a8d29fb7e077c61484c

      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "16px" }}>
        {/*<StartCommande />*/}
        {/*<RecupCommande />*/}
        <DataLoading />
      </main>
    </div>
  );
}