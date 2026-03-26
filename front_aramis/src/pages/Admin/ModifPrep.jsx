import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModifPrep() {
  const navigate = useNavigate();
  const { id } = useParams();

  const testData = {
    firstname: "Damien",
    lastname: "Blaise",
    login: "dblaise",
    isAdmin: false,
  };

  const [form, setForm] = useState(testData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://147.93.55.68/user/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const user = await response.json();

        setForm({
          firstname: user.firstname ?? testData.firstname,
          lastname: user.lastname ?? testData.lastname,
          login: user.login ?? testData.login,
          isAdmin: user.admin ?? false,
        });
      } catch (error) {
        console.warn("API non dispo -> fallback");
        setForm(testData);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const closeErrorPopup = () => {
    setErrorOpen(false);
  };

  const handleUpdate = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    if (!form.firstname || !form.lastname || !form.login) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setErrorOpen(true);
      return;
    }

    const payload = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      login: form.login.trim(),
      admin: form.isAdmin,
    };

    try {
      setSaving(true);

      const response = await fetch(`http://147.93.55.68/user/update/${id}`, {
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
          "Erreur modification.";

        if (backendMessage.toLowerCase().includes("bad request")) {
          backendMessage = "Données invalides. Vérifiez les champs.";
        }

        throw new Error(backendMessage);
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-prep");
      }, 1500);
    } catch (error) {
      console.warn("Erreur modification préparateur :", error);

      let message = error.message || "Erreur lors de la modification.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message =
          "Impossible de modifier ce préparateur. Vérifiez les données saisies.";
      }

      setErrorMessage(message);
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate("/gestion-prep");

  if (loading) {
    return (
      <div className="p-4 mt-[200px] flex justify-center text-[24px] font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-4 mt-[200px] flex flex-col items-center relative">
      <div className="w-[1000px] flex flex-col items-center">
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Prénom
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Nom
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Login
              </th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">
                Superviseur
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-[20px]">
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={handleChange}
                  className="w-[25px] h-[25px]"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#CCB5A5] rounded-[50px] disabled:opacity-50"
        >
          {saving ? "Modification..." : "Modifier"}
        </button>
      </div>

      {successOpen && (
        <div className="fixed bottom-8 z-50 w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">Préparateur modifié avec succès !</span>
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
        Retour à la gestion des préparateurs
      </button>
    </div>
  );
}

export default ModifPrep;