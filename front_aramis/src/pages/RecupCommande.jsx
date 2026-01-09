import { useEffect, useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h3 className="font-bold font-inter text-[30px] m-[5px]">
        {username}
      </h3>

      <p className="text-[30px] mb-[150px] font-bold">
        {date}
      </p>

      <button className="bg-[#000] text-[#fff] px-[50px] py-[50px] rounded-[10px] font-medium font-inter text-[30px] focus:bg-[#333] transition-colors">
        Récuperer X palette(s)
      </button>
    </div>
  );
}

