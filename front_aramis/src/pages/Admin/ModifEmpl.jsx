import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModifEmpl() {
  const navigate = useNavigate();
  const { id } = useParams();

  const testData = {
    locationCode: "E-023",
    drivewayId: 2,
    levelId: 1,
  };

  const [form, setForm] = useState({
    locationCode: "",
    drivewayId: "",
    levelId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/position/${id}`, {
          method: "GET",
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const position = await response.json();

        setForm({
          locationCode: position.locationCode || "",
          drivewayId: position.driveway?.drivewayID ?? "",
          levelId: position.level?.levelID ?? "",
        });
      } catch (error) {
        console.warn("API non dispo -> fallback test data");
        setForm(testData);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPosition();
    }
  }, [id]);

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

  const handleUpdate = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    if (!form.locationCode || !form.drivewayId || !form.levelId) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setErrorOpen(true);
      return;
    }

    const payload = {
      locationCode: form.locationCode,
      drivewayId: Number(form.drivewayId),
      levelId: Number(form.levelId),
    };

    try {
      setSaving(true);

      const response = await fetch(`/api/position/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const backendMessage =
          data?.message ||
          data?.error ||
          data?.details ||
          (typeof data === "string" ? data : null) ||
          "Modification impossible.";

        throw new Error(backendMessage);
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-empl");
      }, 1500);
    } catch (error) {
      console.warn("Erreur modification emplacement :", error);

      let message = error.message || "Erreur lors de la modification.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message =
          "Impossible de modifier cet emplacement. Vérifiez les données saisies.";
      }

      setErrorMessage(message);
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate("/gestion-empl");

  if (loading) {
    return (
      <div className="p-4 mt-[200px] flex justify-center text-[24px] font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-4 mt-[200px] flex flex-col items-center relative">
      <div className="w-[900px] flex flex-col items-center">
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Code emplacement
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                ID Allée
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                ID Niveau
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
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="number"
                  name="drivewayId"
                  value={form.drivewayId}
                  onChange={handleChange}
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="number"
                  name="levelId"
                  value={form.levelId}
                  onChange={handleChange}
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-[800] bg-[#CCB5A5] rounded-[50px] disabled:opacity-50"
        >
          {saving ? "Modification..." : "Modifier"}
        </button>
      </div>

      {successOpen && (
        <div className="fixed bottom-8 z-50 w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">Emplacement modifié avec succès !</span>
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
        disabled={saving}
        className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#D9D9D9] rounded-[50px]"
      >
        Retour à la gestion des emplacements
      </button>
    </div>
  );
}

export default ModifEmpl;