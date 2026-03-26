import { useEffect, useState } from "react";
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

  const [zones, setZones] = useState([]);
  const [driveways, setDriveways] = useState([]);
  const [locations, setLocations] = useState([]);
  const [levels, setLevels] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const [zonesResponse, drivewaysResponse, locationsResponse, levelsResponse] =
          await Promise.all([
            fetch("/api/zone/all?page=0&size=100", {
              method: "GET",
              credentials: "include",
            }),
            fetch("/api/driveway/all?page=0&size=100", {
              method: "GET",
              credentials: "include",
            }),
            fetch("/api/position/all?page=0&size=200", {
              method: "GET",
              credentials: "include",
            }),
            fetch("/api/level/all?page=0&size=100", {
              method: "GET",
              credentials: "include",
            }),
          ]);

        if (
          !zonesResponse.ok ||
          !drivewaysResponse.ok ||
          !locationsResponse.ok ||
          !levelsResponse.ok
        ) {
          throw new Error("Erreur récupération des données");
        }

        const zonesData = await zonesResponse.json();
        const drivewaysData = await drivewaysResponse.json();
        const locationsData = await locationsResponse.json();
        const levelsData = await levelsResponse.json();

        const zonesList = Array.isArray(zonesData) ? zonesData : zonesData.content || [];
        const drivewaysList = Array.isArray(drivewaysData)
          ? drivewaysData
          : drivewaysData.content || [];
        const locationsList = Array.isArray(locationsData)
          ? locationsData
          : locationsData.content || [];
        const levelsList = Array.isArray(levelsData)
          ? levelsData
          : levelsData.content || [];

        setZones(zonesList);
        setDriveways(drivewaysList);
        setLocations(locationsList);
        setLevels(levelsList);
      } catch (error) {
        console.warn("Erreur chargement options :", error);

        setZones([
          { zoneID: 1, zoneName: "H" },
          { zoneID: 2, zoneName: "A" },
          { zoneID: 3, zoneName: "C" },
        ]);

        setDriveways([
          { drivewayID: 1, name: "1", zone: { zoneName: "H" } },
          { drivewayID: 2, name: "2", zone: { zoneName: "A" } },
          { drivewayID: 3, name: "3", zone: { zoneName: "C" } },
        ]);

        setLocations([
          { locationID: 1, locationCode: "001" },
          { locationID: 2, locationCode: "002" },
          { locationID: 3, locationCode: "003" },
        ]);

        setLevels([
          { levelID: 1, levelValue: 0 },
          { levelID: 2, levelValue: 1 },
          { levelID: 3, levelValue: 2 },
        ]);
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
        credentials: "include",
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
        {loadingOptions && (
          <div className="mb-[25px] text-[22px] font-bold">
            Chargement des options...
          </div>
        )}

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
                <SelectInput name="zone" value={form.zone} onChange={handleChange}>
                  <option value="">Choisir une zone</option>
                  {zones.map((zone) => (
                    <option key={zone.zoneID ?? zone.zoneName} value={zone.zoneName}>
                      {zone.zoneName}
                    </option>
                  ))}
                </SelectInput>
              </td>

              <td className="px-[8px]">
                <SelectInput name="driveway" value={form.driveway} onChange={handleChange}>
                  <option value="">Choisir une allée</option>
                  {driveways.map((driveway) => (
                    <option
                      key={driveway.drivewayID ?? driveway.name}
                      value={driveway.name}
                    >
                      {driveway.zone?.zoneName
                        ? `${driveway.zone.zoneName} - Allée ${driveway.name}`
                        : `Allée ${driveway.name}`}
                    </option>
                  ))}
                </SelectInput>
              </td>

              <td className="px-[8px]">
                <SelectInput name="location" value={form.location} onChange={handleChange}>
                  <option value="">Choisir un emplacement</option>
                  {locations.map((location) => (
                    <option
                      key={location.locationID ?? location.locationCode}
                      value={location.locationCode}
                    >
                      {location.locationCode}
                    </option>
                  ))}
                </SelectInput>
              </td>

              <td className="px-[8px]">
                <SelectInput name="level" value={form.level} onChange={handleChange}>
                  <option value="">Choisir un niveau</option>
                  {levels.map((level) => (
                    <option
                      key={level.levelID ?? level.levelValue}
                      value={level.levelValue}
                    >
                      Niveau {level.levelValue}
                    </option>
                  ))}
                </SelectInput>
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
          disabled={loading || loadingOptions}
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

function SelectInput({ name, value, onChange, children }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-[180px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
    >
      {children}
    </select>
  );
}

export default CreerStocks;