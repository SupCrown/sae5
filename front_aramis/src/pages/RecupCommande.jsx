import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Usericone from "../assets/images/ProfileIcon.png";
import cerclePng from "../assets/images/cercle.png"; 

export default function RecupCommande() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { nbPalettes, order } = location.state || { nbPalettes: 0 };

  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Utilisateur");
    setDate(new Date().toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
    }));
  }, []);

  return (
    <div className="relative h-screen bg-white text-black flex flex-col items-center justify-center">
      {/* Tes images cercles ici... */}

      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src={Usericone} alt="User" className="w-[90px] h-40 mb-10" />
        <h3 className="font-bold text-[30px]">{username}</h3>
        <p className="text-[30px] mb-20 font-bold">{date}</p>

        <button 
          onClick={() => navigate("/palette", { state: { order } })}
          className="bg-black text-white px-12 py-8 rounded-xl font-bold text-[24px] hover:bg-gray-800 transition-colors shadow-2xl"
        >
          Récupérer {nbPalettes} palette(s)
        </button>
      </div>
    </div>
  );
}