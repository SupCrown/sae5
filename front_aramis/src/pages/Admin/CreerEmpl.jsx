import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerEmpl() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationCode: "",
    drivewayId: "",
    levelId: "",
  });

  const [driveways, setDriveways] = useState([]);
  const [levels, setLevels] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fallbackDriveways = [
    { drivewayID: 1, name: "1", zone: { zoneName: "H" } },
    { drivewayID: 2, name: "2", zone: { zoneName: "H" } },
    { drivewayID: 3, name: "3", zone: { zoneName: "A" } },
  ];

  const fallbackLevels = [
    { levelID: 1, levelValue: 0 },
    { levelID: 2, levelValue: 1 },
    { levelID: 3, levelValue: 2 },
    { levelID: 4, levelValue: 3 },
  ];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const [drivewayResponse, levelResponse] = await Promise.all([
          fetch("http://147.93.55.68/driveway/all?page=0&size=100", {
            method: "GET",
          }),
          fetch("http://147.93.55.68/level/all?page=0&size=100", {
            method: "GET",
          }),
        ]);

        if (!drivewayResponse.ok || !levelResponse.ok) {
          throw new Error("Erreur récupération options");
        }

        const drivewayData = await drivewayResponse.json();
        const levelData = await levelResponse.json();

        const drivewayList = Array.isArray(drivewayData)
          ? drivewayData
          : drivewayData.content || [];

        const levelList = Array.isArray(levelData)
          ? levelData
          : levelData.content || [];

        setDriveways(drivewayList.length ? drivewayList : fallbackDriveways);
        setLevels(levelList.length ? levelList : fallbackLevels);
      } catch (error) {
        console.warn("API indisponible -> fallback options");
        setDriveways(fallbackDriveways);
        setLevels(fallbackLevels);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeErrorPopup = () => {
    setErrorOpen(false);
  };

  const handleCreate = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    if (!form.locationCode || !form.drivewayId || !form.levelId) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setErrorOpen(true);
      return;
    }

    const payload = {
      locationCode: form.locationCode.trim(),
      drivewayId: Number(form.drivewayId),
      levelId: Number(form.levelId),
    };

    try {
      setLoading(true);

      const response = await fetch("http://147.93.55.68/position/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        let backendMessage =
          data?.message ||
          data?.error ||
          data?.details ||
          (typeof data === "string" ? data : null) ||
          "Erreur lors de la création.";

        if (backendMessage.toLowerCase().includes("bad request")) {
          backendMessage = "Données invalides. Vérifiez les champs.";
        }

        throw new Error(backendMessage);
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-empl");
      }, 1500);
    } catch (error) {
      console.error("Erreur API :", error);

      let message = error.message || "Erreur lors de la création.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message = "Erreur serveur. Vérifiez les données saisies.";
      }

      setErrorMessage(message);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/gestion-empl");

  return (
    <div className="p-4 mt-[200px] flex flex-col items-center relative">
      <div className="w-[1000px] flex flex-col items-center">
        {loadingOptions && (
          <div className="mb-[30px] text-[22px] font-bold">
            Chargement des allées et niveaux...
          </div>
        )}

        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Code emplacement
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Allée
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Niveau
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-[20px]">
                <input
                  type="text"
                  name="locationCode"
                  value={form.locationCode}
                  onChange={handleChange}
                  placeholder="..."
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <select
                  name="drivewayId"
                  value={form.drivewayId}
                  onChange={handleChange}
                  className="w-[260px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                >
                  <option value="">Choisir une allée</option>
                  {driveways.map((driveway) => (
                    <option
                      key={driveway.drivewayID}
                      value={driveway.drivewayID}
                    >
                      {driveway.zone?.zoneName
                        ? `${driveway.zone.zoneName} - Allée ${driveway.name}`
                        : `Allée ${driveway.name}`}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-[20px]">
                <select
                  name="levelId"
                  value={form.levelId}
                  onChange={handleChange}
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                >
                  <option value="">Choisir un niveau</option>
                  {levels.map((level) => (
                    <option key={level.levelID} value={level.levelID}>
                      Niveau {level.levelValue}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={handleCreate}
          disabled={loading || loadingOptions}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-[800] bg-[#CCB5A5] rounded-[50px] disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </div>

      {successOpen && (
        <div className="fixed bottom-8 z-50 w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">Emplacement créé avec succès !</span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
              ✓
            </div>
          </div>
        </div>
      )}

      {errorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#ffffff] w-[650px] border-2 border-black rounded-[20px]">
            <div className="p-6">
              <p className="text-center text-[24px] font-bold text-red-600">
                Erreur
              </p>
              <p className="text-center text-[20px] font-bold mt-[20px]">
                {errorMessage}
              </p>
              <div className="border-b border-black mt-6" />
            </div>

            <div className="pb-8 flex justify-center">
              <button
                onClick={closeErrorPopup}
                type="button"
                className="bg-[#863545] text-white font-extrabold text-[28px] px-[40px] py-[12px] rounded-[40px] m-[15px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={goBack}
        disabled={loading || loadingOptions}
        className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#D9D9D9] rounded-[50px]"
      >
        Retour à la gestion des emplacements
      </button>
    </div>
  );
}

export default CreerEmpl;