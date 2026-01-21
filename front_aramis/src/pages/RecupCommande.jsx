import { useEffect, useState } from "react";
import Usericone from "../assets/images/ProfileIcon.png";
import bg from "../assets/images/cercleFond.svg";

export default function RecupCommande() {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "Utilisateur");

    setDate(
      new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen relative bg-white text-black">
      {/* Background layer */}
      <div
  className="absolute inset-0"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top center",
    backgroundSize: "900px",
    filter: "contrast(1.2) brightness(0.9)",
    opacity: 0.6,
  }}
/>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-4">
        <img src={Usericone} alt="Usericone" className="w-40 h-40 mb-[50px]" />

        <h3 className="font-bold font-inter text-[30px] m-[5px]">{username}</h3>

        <p className="text-[30px] mb-[150px] font-bold">{date}</p>

        <button className="bg-black text-white px-[50px] py-[50px] rounded-[10px] font-medium font-inter text-[30px] focus:bg-[#333] transition-colors">
          Récupérer X palette(s)
        </button>
      </div>
    </div>
  );
}