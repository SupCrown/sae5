import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/saisie-stocks-plus.png";

function SaisieStocks() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isCsv =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      alert("Veuillez sélectionner un fichier CSV");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleImportStocks = async () => {
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner un fichier CSV");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/stock/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'import du fichier CSV");
      }

      alert("Import des stocks réussi");
      navigate("/gestion-stocks");
    } catch (error) {
      console.error(error);
      alert("L'import a échoué");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Bouton CSV */}
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-col items-center gap-2 px-[400px] py-[70px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[10px]"
      >
        {fileName ? (
          <span>{fileName}</span>
        ) : (
          <>
            <label>Ajouter un fichier CSV</label>
            <img
              src={plusIcon}
              alt="Plus Icon"
              className="w-[52px] h-[52px] m-[20px]"
            />
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

      {/* Bouton Import / Créer / Modifier */}
      <button
        type="button"
        onClick={handleImportStocks}
        disabled={isLoading}
        className="flex flex-col items-center gap-2 px-[100px] py-[30px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[80px] disabled:opacity-50"
      >
        {isLoading ? "Import en cours..." : "Créer / Modifier"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/gestion-stocks")}
        className="flex flex-col items-center gap-2 px-[100px] py-[30px] mt-[20px] text-[20px] font-bold bg-gray-600 text-white rounded-[80px]"
      >
        Retour à la gestion des stocks
      </button>
    </div>
  );
}

export default SaisieStocks;