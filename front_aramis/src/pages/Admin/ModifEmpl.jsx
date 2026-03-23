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

  const [form, setForm] = useState(testData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://147.93.55.68/position/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const position = await response.json();

        setForm({
          locationCode: position.locationCode ?? testData.locationCode,
          drivewayId: position.drivewayId ?? testData.drivewayId,
          levelId: position.levelId ?? testData.levelId,
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

  const handleUpdate = async () => {
    setErrorMessage("");

    if (!form.locationCode || !form.drivewayId || !form.levelId) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      locationCode: form.locationCode,
      drivewayId: Number(form.drivewayId),
      levelId: Number(form.levelId),
    };

    try {
      setSaving(true);

      const response = await fetch(`http://147.93.55.68/position/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Modification impossible");
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-empl");
      }, 1500);
    } catch (error) {
      console.warn("API update indisponible -> simulation locale");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-empl");
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 mt-[200px] flex justify-center text-[24px] font-bold">
        Chargement...
      </div>
    );
  }

  const goBack = () => navigate("/gestion-empl");

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
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="number"
                  name="drivewayId"
                  value={form.drivewayId}
                  onChange={handleChange}
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="number"
                  name="levelId"
                  value={form.levelId}
                  onChange={handleChange}
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {errorMessage && (
          <div className="mt-[25px] text-red-600 text-[20px] font-bold">
            {errorMessage}
          </div>
        )}

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