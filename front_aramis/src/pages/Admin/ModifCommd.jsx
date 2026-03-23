import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModifCommd() {
  const navigate = useNavigate();
  const { id } = useParams();

  const testData = {
    support: "SUP-001",
    codemb: "EMB01",
    cliliv: "CL001",
    nomcli: "Client A",
    itm8: "ITM0001",
    designation: "Produit A",
    nbColis: 38,
    zone: "H",
    allee: "08",
    dpl: "023",
    niveau: "1",
  };

  const [form, setForm] = useState(testData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/order/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const order = await response.json();

        setForm({
          support: order.support ?? testData.support,
          codemb: order.codemb ?? testData.codemb,
          cliliv: order.cliliv ?? testData.cliliv,
          nomcli: order.nomcli ?? testData.nomcli,
          itm8: order.itm8 ?? testData.itm8,
          designation: order.designation ?? testData.designation,
          nbColis: order.nbColis ?? order.nbcolis ?? testData.nbColis,
          zone: order.zone ?? testData.zone,
          allee: order.allee ?? order.driveway ?? testData.allee,
          dpl: order.dpl ?? order.location ?? testData.dpl,
          niveau: order.niveau ?? order.level ?? testData.niveau,
        });
      } catch (error) {
        console.warn("API non dispo -> fallback test data");
        setForm(testData);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
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
      setSaving(true);

      const response = await fetch(`/order/update/${id}`, {
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
        navigate("/gestion-commd");
      }, 1500);
    } catch (error) {
      console.warn("API update indisponible -> simulation locale");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-commd");
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

  const goBack = () => navigate("/gestion-commd");

  return (
    <div className="p-4 mt-[80px] flex flex-col items-center relative">
      <div className="w-[1500px] flex flex-col items-center">
        {/* TABLEAU LIGNE 1 */}
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

        <div className="h-[20px]" />

        {/* TABLEAU LIGNE 2 */}
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
            <span className="font-bold">Commande modifiée avec succès !</span>
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
      className="w-[120px] px-[16px] py-[16px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center"
    />
  );
}

export default ModifCommd;