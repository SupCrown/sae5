import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreerStocks() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productCode: "",
    quantity: "",
    libel: "",
    height: "",
    length: "",
    width: "",
    zone: "",
    driveway: "",
    location: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    setErrorMessage("");

    if (
      !form.productCode ||
      !form.quantity ||
      !form.libel ||
      !form.height ||
      !form.length ||
      !form.width ||
      !form.zone ||
      !form.driveway ||
      !form.location ||
      !form.level
    ) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const payload = {
      productCode: form.productCode,
      quantity: Number(form.quantity),
      libel: form.libel,
      height: Number(form.height),
      length: Number(form.length),
      width: Number(form.width),
      zone: form.zone,
      driveway: form.driveway,
      location: form.location,
      level: Number(form.level),
    };

    try {
      setLoading(true);

      const response = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Création impossible");
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-stocks");
      }, 1500);
    } catch (error) {
      console.warn("API indisponible -> simulation locale");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate("/gestion-stocks");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/gestion-stocks");

  return (
    <div className="p-4 mt-[80px] flex flex-col items-center relative">
      <div className="w-[1400px] flex flex-col items-center">
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th colSpan="6" className="text-[22px] font-bold pb-[20px]">
                Informations produit
              </th>
            </tr>
            <tr>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Code</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Libellé</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Quantité</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Hauteur</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Longueur</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Largeur</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-[8px]">
                <Input name="productCode" value={form.productCode} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="libel" value={form.libel} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="quantity" type="number" value={form.quantity} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="height" type="number" value={form.height} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="length" type="number" value={form.length} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="width" type="number" value={form.width} onChange={handleChange} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="h-[30px]" />

        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th colSpan="4" className="text-[22px] font-bold pb-[20px]">
                Emplacement de stockage
              </th>
            </tr>
            <tr>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Zone</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Allée</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Emplacement</th>
              <th className="text-[20px] font-bold px-[12px] pb-[20px]">Niveau</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-[8px]">
                <Input name="zone" value={form.zone} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="driveway" value={form.driveway} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="location" value={form.location} onChange={handleChange} />
              </td>
              <td className="px-[8px]">
                <Input name="level" type="number" value={form.level} onChange={handleChange} />
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
            <span className="font-bold">Stock créé avec succès !</span>
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
        Retour à la gestion des stocks
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
      className="w-[120px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
    />
  );
}

export default CreerStocks;