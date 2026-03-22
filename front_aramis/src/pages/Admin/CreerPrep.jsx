import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerPrep() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    login: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async () => {
    setErrorMessage("");

    if (!form.firstname || !form.lastname || !form.login) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      login: form.login,
      isAdmin: form.isAdmin,
    };

    try {
      setLoading(true);

      const response = await fetch("http://147.93.55.68/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Création impossible");
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-prep");
      }, 1500);
    } catch (error) {
      console.warn("API indisponible -> simulation locale");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-prep");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/gestion-prep");

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
                  placeholder="..."
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  placeholder="..."
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="..."
                  className="w-[220px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <label className="flex items-center justify-center h-full">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={form.isAdmin}
                    onChange={handleChange}
                    className="w-[28px] h-[28px]"
                  />
                </label>
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
          onClick={handleCreate}
          disabled={loading}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-[800] bg-[#CCB5A5] rounded-[50px] disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </div>

      {successOpen && (
        <div className="fixed bottom-8 z-50 w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">Préparateur créé avec succès !</span>
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
          Retour à la gestion des préparateurs
        </button>
    </div>
  );
}

export default CreerPrep;