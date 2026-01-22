import { useEffect, useState } from "react";
import Usericone from "../assets/images/ProfileIcon.png";
import cerclePng from "../assets/images/cercle.png"; 


export default function StartCommande() {
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
      <div className="min-h-screen relative bg-white text-black overflow-hidden">
        <img
          src={cerclePng}
          alt=""
          className="pointer-events-none select-none absolute top-[70px] left-1/2 -translate-x-1/2 w-[350px] opacity-25"
        />
  
        <img
          src={cerclePng}
          alt=""
          className="pointer-events-none select-none absolute top-[200px] left-[50px] w-[350px] opacity-25"
        />
  
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-4">
          <img src={Usericone} alt="Usericone" className="w-[80px] h-40 mb-[60px] mt-[70px]" />
  
          <h3 className="font-bold font-inter text-[30px] m-[5px]">{username}</h3>
  
          <p className="text-[30px] mb-[80px] font-bold">{date}</p>
  
          <button className="bg-black text-white px-[50px] py-[50px] rounded-[10px] font-medium font-inter text-[30px] focus:bg-[#333] transition-colors">
          Commencer la journée
          </button>
        </div>
      </div>
    );
}

