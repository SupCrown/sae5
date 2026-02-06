import './App.css'
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ListenPage from "./pages/ListenPage";
import Home from "./pages/Home";
import StartCommande from "./pages/StartCommande";
import RecupCommande from "./pages/RecupCommande";
import DataLoading from "./pages/DataLoading";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / test Tailwind */}
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold text-blue-400">
          Vite + Tailwind OK
        </h1>
      </div>

      {/* Page principale */}
      <div className="flex justify-center">
        <Home />
      </div>
    </div>
  );
}