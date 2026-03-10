import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserIcon from "./assets/User.png";
import ArrowBack from "./assets/Flechegauche.png";

export default function App() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    const user = localStorage.getItem("userName");
    if (user) setUserName(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleNavigation = (e) => {
    navigate(e.target.value);
  };

  return (
    <div>
      <header className="flex items-center justify-between px-6 py-4 border-b-[10px] border-[#AD211B] bg-white">

        {/* FLECHE DECONNEXION */}
        <button
          onClick={handleLogout}
          className="border-2 border-[#000000] px-6 py-2 hover:bg-gray-100 transition bg-[#ffffff]"
        >
          <img src={ArrowBack} alt="Retour" className="w-[30px] px-[60px]" />
        </button>

        {/* SELECT NAVIGATION */}
        <select
          onChange={handleNavigation}
          className="text-[20px] font-bold px-[6px] py-[2px] border-2 border-black rounded-md shadow-sm bg-white cursor-pointer hover:bg-gray-100"
        >
          <option value="/gestion-prep">Gestion Préparateurs</option>
          <option value="/gestion-empl">Gestion Emplacements</option>
          <option value="/gestion-commd">Gestion Commandes</option>
          <option value="/saisie-stocks">Saisie Stocks</option>
          <option value="/stat">Statistiques</option>
        </select>

        {/* UTILISATEUR */}
        <div className="flex items-center gap-3 text-[20px] font-bold">
          <span>{userName}</span>
          <img src={UserIcon} alt="User Icon" className="w-[40px] h-[40px] m-[12px]" />
        </div>

      </header>

      <Outlet />
    </div>
  );
}