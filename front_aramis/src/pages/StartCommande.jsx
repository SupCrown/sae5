import { useEffect, useState } from "react";

export default function StartCommande() {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    setUsername(storedUser || "Utilisateur");

    setDate(
      new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h3 className="font-normal text-2xl">{username}</h3>
      <p className="opacity-90">{date}</p>

      <button className="bg-[#000] text-[#fff] px-[60px] py-[30px] rounded-[5px] border-[#000]">
        Commencer la journée
      </button>
      
    </div>
  );
}