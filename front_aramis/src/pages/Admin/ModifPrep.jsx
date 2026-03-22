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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/user/${id}`, {
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
          isAdmin: user.isAdmin ?? false,
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

  const handleUpdate = async () => {
    setErrorMessage("");

    if (!form.firstname || !form.lastname || !form.login) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      login: form.login,
      isAdmin: form.isAdmin,
    };

    try {
      setSaving(true);

      const response = await fetch(`/user/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur modification");
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-prep");
      }, 1500);
    } catch (error) {
      console.warn("API update indisponible -> simulation");

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-prep");
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

  const goBack = () => navigate("/gestion-prep");

  return (
    <div className="p-4 mt-[200px] flex flex-col items-center relative">
      <div className="w-[1000px] flex flex-col items-center">

        {/* TABLE */}
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">Prénom</th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">Nom</th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">Login</th>
              <th className="text-[30px] font-bold px-[40px] pb-[20px]">Superviseur</th>
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
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[20px]">
                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  className="w-[200px] px-[20px] py-[20px] border rounded-[50px] bg-[#CCB5A5] text-center"
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

        {errorMessage && (
          <div className="mt-[20px] text-red-600 font-bold">
            {errorMessage}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#CCB5A5] rounded-[50px]"
        >
          {saving ? "Modification..." : "Modifier"}
        </button>
      </div>

      {/* SUCCESS POPUP */}
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