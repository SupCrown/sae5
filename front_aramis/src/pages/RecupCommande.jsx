import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext"; // Import du context indispensable
import Usericone from "../assets/images/ProfileIcon.png";
import cerclePng from "../assets/images/cercle.png"; 

export default function RecupCommande() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOrderManually } = useOrder(); // On récupère la fonction pour remplir le store global
  
  // On récupère les données passées par DataLoading
  const { nbPalettes, order } = location.state || { nbPalettes: 0, order: null };

  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Utilisateur");
    setDate(new Date().toLocaleDateString("fr-FR", {
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric",
    }));

    // Sécurité : Si on arrive sur cette page sans commande (ex: refresh), on repart au chargement
    if (!order) {
      console.warn("Aucune commande reçue dans RecupCommande, redirection...");
      navigate("/loading");
    }
  }, [order, navigate]);

  const handleConfirmRecup = () => {
    if (order) {
      // 1. On injecte la commande dans le Context pour que PalettePage puisse la lire
      setOrderManually(order);
      
      // 2. On change de page
      navigate("/palette");
    }
  };

  return (
    <div className="relative h-screen bg-white text-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Arrière-plan décoratif (Cercles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <img src={cerclePng} alt="" className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[500px]" />
        <img src={cerclePng} alt="" className="absolute bottom-[80px] left-[250px] w-[420px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Icône Profil */}
        <div className="bg-gray-100 p-8 rounded-full mb-6">
          <img src={Usericone} alt="User" className="w-[100px] h-[100px] object-contain" />
        </div>

        {/* Infos Utilisateur */}
        <h3 className="font-bold text-[40px] uppercase tracking-tight text-gray-900">
          {username}
        </h3>
        <p className="text-[24px] mb-16 text-gray-500 font-medium">
          Session du {date}
        </p>

        {/* Bouton d'action */}
        <button 
          onClick={handleConfirmRecup}
          className="bg-black text-white px-16 py-8 rounded-2xl font-bold text-[28px] hover:bg-gray-800 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        >
          {order?.type === "PICK_PRODUCT" ? "Reprendre la mission" : `Récupérer ${nbPalettes || 1} palette(s)`}
        </button>

        {/* Info complémentaire discrète */}
        <p className="mt-8 text-gray-400 text-sm font-mono uppercase tracking-widest">
          ID Commande: #{order?.orderID || "---"}
        </p>
      </div>

      {/* Barre de marque en haut */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[#870000]" />
    </div>
  );
}