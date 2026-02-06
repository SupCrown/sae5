import './App.css'
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ListenPage from "./pages/ListenPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">

        <div className="flex justify-center gap-4">
          <Link to="/">
            <button>Accueil</button>
          </Link>

          <Link to="/listen">
            <button>Aller à ListenPage</button>
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listen" element={<ListenPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}