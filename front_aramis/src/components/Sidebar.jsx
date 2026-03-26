import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { useState, useEffect } from "react";

export default function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);

  useEffect(() => {
    authService.getRole().then(userRole => {
      setRole(userRole);
    });
  }, []); // 'admin' ou 'prep'

  // Menu principal (Accessible à tous)
  const mainMenuItems = [
    { label: "Accueil", path: "/" },
    { label: "Palette 3D", path: "/palette" },
    { label: "Démarrer Commande", path: "/start" },
    { label: "Écoute (Listen)", path: "/listen" },
  ];

  // Menu Administration (Admin uniquement)
  const adminMenuItems = [
    { label: "Gestion Préparateurs", path: "/gestion-prep" },
    { label: "Gestion Emplacements", path: "/gestion-empl" },
    { label: "Gestion Commandes", path: "/gestion-commd" },
    { label: "Gestion Stocks", path: "/gestion-stocks" },
    { label: "Gestion Clients", path: "/gestion-cli" },
    { label: "Statistiques", path: "/stat" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    } finally {
      closeSidebar();
      navigate("/auth");
    }
  };

  const MenuButton = ({ item }) => (
    <button
      onClick={() => handleNavigation(item.path)}
      className={`w-full text-left px-8 py-4 transition-all font-bold uppercase text-[11px] tracking-widest ${
        location.pathname === item.path
          ? "bg-red-50 text-[#870000] border-r-8 border-[#870000]"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {item.label}
    </button>
  );

  return (
    <nav className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[#870000] font-black text-2xl italic">ARAMIS</h2>
        <button onClick={closeSidebar} className="text-gray-400 hover:text-black text-2xl">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Section Navigation Principale */}
        <div className="py-4">
          <p className="px-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">Navigation</p>
          {mainMenuItems.map((item) => (
            <MenuButton key={item.path} item={item} />
          ))}
        </div>

        {/* Section Administration - Affichée UNIQUEMENT pour l'admin */}
        {role === "ADMIN" && (
          <div className="py-4 border-t border-gray-50">
            <p className="px-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">Administration</p>
            {adminMenuItems.map((item) => (
              <MenuButton key={item.path} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer avec Logout */}
      <div className="p-8 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#870000] transition-colors duration-300 shadow-lg"
        >
          → DECONNEXION
        </button>
      </div>
    </nav>
  );
}