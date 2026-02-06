import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / test Tailwind */}
      <div className="p-6 text-center">
      </div>

      {/* Page principale */}
      <div className="flex justify-center">
        <Home />
      </div>
    </div>
  );
}