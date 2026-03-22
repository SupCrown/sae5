import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Accueil", path: "/" },
    { label: "Palette 3D", path: "/palette" },
    { label: "Démarrer Commande", path: "/start" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar(); // Ferme la barre après le clic
  };

  return (
    <nav className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[#870000] font-black text-2xl italic">ARAMIS</h2>
        <button onClick={closeSidebar} className="text-gray-400 hover:text-black text-2xl">✕</button>
      </div>
      
      <div className="flex-1 py-6">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full text-left px-8 py-5 transition-all font-bold uppercase text-sm tracking-widest ${
              location.pathname === item.path 
                ? "bg-red-50 text-[#870000] border-r-8 border-[#870000]" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}