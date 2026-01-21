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
    <div
      style={{
        minHeight: "100vh",
        border: "4px solid black",     
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
      <main style={{ flex: 1, padding: "16px" }}>
        {/*<StartCommande />*/}
        <RecupCommande />
        {/*<DataLoading />*/}
      </main>
    </div>
  );
}