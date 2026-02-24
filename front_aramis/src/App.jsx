import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home";
import SaisieStocks from "./pages/SaisieStocks";

export default function App() {
  return (
    <div>
      {/* Header */}
      <header
        style={{
          padding: "16px",
          borderBottom: "10px solid #AD211B", 
          textAlign: "center",
        }}
      >

      </header>

      {/* Main Content */}
      <main style={{ padding: "16px" }}>
        <SaisieStocks />
      </main>
    </div>
  );
}