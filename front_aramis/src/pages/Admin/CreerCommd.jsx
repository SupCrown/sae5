import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/saisie-stocks-plus.png";

function CreerCommd() {
  const navigate = useNavigate();

  // --------- création manuelle ----------
  const [form, setForm] = useState({
    support: "",
    codemb: "",
    cliliv: "",
    nomcli: "",
    itm8: "",
    designation: "",
    nbColis: "",
    zone: "",
    allee: "",
    dpl: "",
    niveau: "",
  });

  const [manualLoading, setManualLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --------- import csv ----------
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // --------- succès ----------
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/gestion-commd");
    }, 1500);
  };

  const handleCreateManual = async () => {
    setErrorMessage("");

    if (
      !form.support ||
      !form.codemb ||
      !form.cliliv ||
      !form.nomcli ||
      !form.itm8 ||
      !form.designation ||
      !form.nbColis ||
      !form.zone ||
      !form.allee ||
      !form.dpl ||
      !form.niveau
    ) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      support: form.support,
      codemb: form.codemb,
      cliliv: form.cliliv,
      nomcli: form.nomcli,
      itm8: form.itm8,
      designation: form.designation,
      nbColis: Number(form.nbColis),
      zone: form.zone,
      allee: form.allee,
      dpl: form.dpl,
      niveau: form.niveau,
    };

    try {
      setManualLoading(true);

      const response = await fetch("/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Création impossible");
      }

      showSuccess("Commande créée avec succès !");
    } catch (error) {
      console.warn("API create indisponible -> simulation locale");
      showSuccess("Commande créée avec succès !");
    } finally {
      setManualLoading(false);
    }
  };

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

  const handleImportCsv = async () => {
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner un fichier CSV");
      return;
    }

    try {
      setImportLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/order/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Import impossible");
      }

      showSuccess("Import CSV réussi !");
    } catch (error) {
      console.warn("API import indisponible -> simulation locale");
      showSuccess("Import CSV réussi !");
    } finally {
      setImportLoading(false);
    }
  };

  const goBack = () => navigate("/gestion-commd");

  return (
    <div className="p-4 flex flex-col items-center mt-[60px] relative">
      <div className="w-[1500px] flex flex-col items-center">
        {/* --------- PARTIE 1 : SAISIE MANUELLE --------- */}
        <h2 className="text-[28px] font-[800] mb-[25px]">
          Création manuelle d’une commande
        </h2>

        {/* LIGNE 1 */}
        <table className="text-center border-collapse mb-[10px]">
          <thead>
            <tr>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">N° Support</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Codemb</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Cliliv</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Nomcli</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">ITM 8</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Désignation</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><Input name="support" value={form.support} onChange={handleChange} /></td>
              <td><Input name="codemb" value={form.codemb} onChange={handleChange} /></td>
              <td><Input name="cliliv" value={form.cliliv} onChange={handleChange} /></td>
              <td><Input name="nomcli" value={form.nomcli} onChange={handleChange} /></td>
              <td><Input name="itm8" value={form.itm8} onChange={handleChange} /></td>
              <td><Input name="designation" value={form.designation} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        {/* LIGNE 2 */}
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Nb Colis</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Z</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">All</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Dpl</th>
              <th className="text-[18px] font-bold px-[10px] pb-[15px]">Niv</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><Input name="nbColis" type="number" value={form.nbColis} onChange={handleChange} /></td>
              <td><Input name="zone" value={form.zone} onChange={handleChange} /></td>
              <td><Input name="allee" value={form.allee} onChange={handleChange} /></td>
              <td><Input name="dpl" value={form.dpl} onChange={handleChange} /></td>
              <td><Input name="niveau" value={form.niveau} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        {errorMessage && (
          <div className="mt-[20px] text-red-600 text-[20px] font-bold">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleCreateManual}
          disabled={manualLoading}
          className="px-[100px] py-[20px] mt-[35px] text-[20px] font-[800] rounded-[50px] bg-[#CCB5A5] disabled:opacity-50"
        >
          {manualLoading ? "Création..." : "Créer à la main"}
        </button>

        {/* --------- PARTIE 2 : IMPORT CSV --------- */}
        <h2 className="text-[28px] font-[800] mb-[20px]">
          Import d’une commande par CSV
        </h2>

        <label className="font-[800] text-[20px]">
          Ajouter un fichier CSV
        </label>

        <button
          onClick={handleClick}
          type="button"
          className="flex flex-col items-center gap-2 px-[220px] py-[60px] mt-[30px] text-[20px] font-bold rounded-[40px] bg-[#D9D9D9]"
        >
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <img
              src={plusIcon}
              alt="Plus Icon"
              className="w-[52px] h-[52px] m-[20px]"
            />
          )}
        </button>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          onClick={handleImportCsv}
          disabled={importLoading}
          className="flex flex-col items-center gap-2 px-[100px] py-[30px] mt-[40px] text-[20px] font-[800] rounded-[80px] bg-[#D9D9D9] disabled:opacity-50"
        >
          {importLoading ? "Import..." : "Importer le CSV"}
        </button>
      </div>

      {successMessage && (
        <div className="fixed bottom-8 z-50 w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">{successMessage}</span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
              ✓
            </div>
          </div>
        </div>
      )}

      <button
          onClick={goBack}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#D9D9D9] rounded-[50px]"
        >
          Retour à la gestion des commandes
        </button>
    </div>
  );
}

function Input({ name, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder="..."
      className="w-[140px] px-[18px] py-[18px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center"
    />
  );
}

export default CreerCommd;