
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "../assets/saisie-stocks-plus.png";

function SaisieStocks() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate(); 

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      alert("Veuillez sélectionner un fichier CSV");
      return;
    }

    setFileName(file.name);
  };

  const goToGestion = () => {
    navigate("/gestion-stocks");
  };

  return (
    <div className="p-4 flex flex-col items-center">

      {/* Bouton CSV */}
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-2 px-[400px] py-[70px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[10px]"
      >
        {fileName ? (
          <span>{fileName}</span>
        ) : (
          <>
            <label>Ajouter un fichier CSV</label>
            <img src={plusIcon} alt="Plus Icon" className="w-[52px] h-[52px] m-[20px]" />
          </>
        )}
      </button>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Bouton Créer / Modifier */}
      <button
        onClick={goToGestion}
        className="flex flex-col items-center gap-2 px-[100px] py-[30px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[80px]"
      >
        Créer / Modifier
      </button>

    </div>
  );
}

export default SaisieStocks;