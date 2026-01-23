import { useEffect, useState } from "react";
import Usericone from "../assets/images/ProfileIcon.png";
import cerclePng from "../assets/images/cercle.png"; 

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
    <div className="relative bg-white text-black flex flex-col items-center justify-center">
      <img
        src={cerclePng}
        alt=""
        className="pointer-events-none select-none absolute top-[70px] left-1/2 -translate-x-1/2 w-[350px] opacity-25"
      />

      <img
        src={cerclePng}
        alt=""
        className="pointer-events-none select-none absolute top-[200px] left-[60px] w-[350px] opacity-25"
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        <img src={Usericone} alt="Usericone" className="w-[90px] h-40 mb-[60px] mt-[200px]" />

        <h3 className="font-bold font-inter text-[30px] m-[5px] mt-[0px] font-intermache">{username}</h3>

        <p className="text-[30px] mb-[80px] font-bold">{date}</p>

        <button className="bg-[#fff] text-[#000] px-[50px] py-[50px] rounded-[10px] font-medium font-inter text-[30px] focus:bg-[#333] transition-colors">
        Récupérer X palette(s)
        </button>
      </div>
    </div>
  );
}

