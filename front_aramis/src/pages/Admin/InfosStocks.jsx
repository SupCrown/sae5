import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function InfosStocks() {
  const navigate = useNavigate();
  const { id } = useParams();

  const testData = {
    productCode: "P-12345",
    quantity: 250,
    libel: "Produit test",
    zone: "B",
    driveway: "12",
    location: "045",
    level: "2",
  };

  const [stock, setStock] = useState(testData);
  const [loading, setLoading] = useState(true);

  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [takePopupOpen, setTakePopupOpen] = useState(false);

  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [quantityToTake, setQuantityToTake] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const goBack = () => navigate("/gestion-stocks");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://147.93.55.68/product/${id}`);

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const product = await response.json();

        setStock({
          productCode: product.productCode ?? testData.productCode,
          quantity: product.quantity ?? testData.quantity,
          libel: product.libel ?? testData.libel,
          zone: product.zone ?? testData.zone,
          driveway: product.driveway ?? testData.driveway,
          location: product.location ?? testData.location,
          level: product.level ?? testData.level,
        });
      } catch (error) {
        console.warn("API non dispo → fallback test data");
        setStock(testData);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const closeErrorPopup = () => {
    setErrorOpen(false);
  };

  const closeAddPopup = () => {
    setAddPopupOpen(false);
    setQuantityToAdd("");
  };

  const closeTakePopup = () => {
    setTakePopupOpen(false);
    setQuantityToTake("");
  };

  const extractBackendMessage = async (response, defaultMessage) => {
    try {
      const data = await response.json();
      return (
        data?.message ||
        data?.error ||
        data?.details ||
        (typeof data === "string" ? data : null) ||
        defaultMessage
      );
    } catch {
      try {
        const text = await response.text();
        return text || defaultMessage;
      } catch {
        return defaultMessage;
      }
    }
  };

  const handleAddStock = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    const qty = Number(quantityToAdd);

    if (!qty || qty <= 0) {
      showError("Veuillez entrer une quantité valide à ajouter.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch("http://147.93.55.68/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productID: Number(id),
          quantityToAdd: qty,
        }),
      });

      if (!response.ok) {
        let message = await extractBackendMessage(
          response,
          "Ajout de stock impossible."
        );

        if (message.toLowerCase().includes("bad request")) {
          message = "Données invalides. Vérifiez la quantité à ajouter.";
        }

        throw new Error(message);
      }

      setStock((prev) => ({
        ...prev,
        quantity: Number(prev.quantity) + qty,
      }));

      closeAddPopup();
      showSuccess("Quantité ajoutée avec succès !");
    } catch (error) {
      console.warn("Erreur ajout stock :", error);

      let message = error.message || "Erreur lors de l’ajout du stock.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message = "Erreur serveur. Impossible d’ajouter cette quantité.";
      }

      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTakeStock = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    const qty = Number(quantityToTake);

    if (!qty || qty <= 0) {
      showError("Veuillez entrer une quantité valide à retirer.");
      return;
    }

    if (qty > Number(stock.quantity)) {
      showError("La quantité à retirer dépasse le stock disponible.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch("http://147.93.55.68/product/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productID: Number(id),
          quantityToTake: qty,
        }),
      });

      if (!response.ok) {
        let message = await extractBackendMessage(
          response,
          "Retrait de stock impossible."
        );

        if (message.toLowerCase().includes("bad request")) {
          message = "Données invalides. Vérifiez la quantité à retirer.";
        }

        throw new Error(message);
      }

      setStock((prev) => ({
        ...prev,
        quantity: Math.max(0, Number(prev.quantity) - qty),
      }));

      closeTakePopup();
      showSuccess("Quantité retirée avec succès !");
    } catch (error) {
      console.warn("Erreur retrait stock :", error);

      let message = error.message || "Erreur lors du retrait du stock.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message = "Erreur serveur. Impossible de retirer cette quantité.";
      }

      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 mt-[200px] flex justify-center text-[24px] font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-4 mt-[120px] flex flex-col items-center relative">
      <div className="w-[1200px] flex flex-col items-center">
        <table className="text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Code</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Libellé</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Quantité</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Zone</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Allée</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Emplacement</th>
              <th className="text-[24px] font-bold px-[20px] pb-[20px]">Niveau</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><Input value={stock.productCode} /></td>
              <td><Input value={stock.libel} /></td>
              <td><Input value={stock.quantity} /></td>
              <td><Input value={stock.zone} /></td>
              <td><Input value={stock.driveway} /></td>
              <td><Input value={stock.location} /></td>
              <td><Input value={stock.level} /></td>
            </tr>
          </tbody>
        </table>

        <div className="flex gap-8 mt-[40px]">
          <button
            onClick={() => setAddPopupOpen(true)}
            disabled={actionLoading}
            className="px-[60px] py-[20px] text-[20px] font-[800] bg-[#CCB5A5] rounded-[50px] disabled:opacity-50"
          >
            Ajouter du stock
          </button>

          <button
            onClick={() => setTakePopupOpen(true)}
            disabled={actionLoading}
            className="px-[60px] py-[20px] text-[20px] font-[800] bg-[#863545] text-white rounded-[50px] ml-[20px] disabled:opacity-50"
          >
            Retirer du stock
          </button>
        </div>
      </div>

      {addPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff]">
          <div className="w-[650px] border-2 border-black rounded-[20px]">
            <div className="p-6">
              <p className="text-center text-[26px] font-bold mb-6">
                Ajouter une quantité au stock
              </p>

              <div className="flex flex-col items-center m-[15px]">
                <input
                  type="number"
                  min="1"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  placeholder="Quantité à ajouter"
                  className="w-[300px] px-[20px] py-[15px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </div>
            </div>

            <div className="pb-8 flex items-center justify-center gap-10">
              <button
                onClick={handleAddStock}
                type="button"
                disabled={actionLoading}
                className="bg-[#E6463A] font-extrabold text-[28px] px-[30px] py-[10px] rounded-[40px] m-[15px] disabled:opacity-50"
              >
                {actionLoading ? "Chargement..." : "Confirmer"}
              </button>

              <button
                onClick={closeAddPopup}
                type="button"
                disabled={actionLoading}
                className="bg-[#863545] text-white font-extrabold text-[28px] px-[30px] py-[10px] rounded-[40px] m-[15px] disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {takePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff]">
          <div className="w-[650px] border-2 border-black rounded-[20px]">
            <div className="p-6">
              <p className="text-center text-[26px] font-bold mb-6">
                Retirer une quantité du stock
              </p>

              <div className="flex flex-col items-center m-[15px]">
                <input
                  type="number"
                  min="1"
                  value={quantityToTake}
                  onChange={(e) => setQuantityToTake(e.target.value)}
                  placeholder="Quantité à retirer"
                  className="w-[300px] px-[20px] py-[15px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center text-[20px]"
                />
              </div>
            </div>

            <div className="pb-8 flex items-center justify-center gap-10">
              <button
                onClick={handleTakeStock}
                type="button"
                disabled={actionLoading}
                className="bg-[#E6463A] font-extrabold text-[28px] px-[30px] py-[10px] rounded-[40px] m-[15px] disabled:opacity-50"
              >
                {actionLoading ? "Chargement..." : "Confirmer"}
              </button>

              <button
                onClick={closeTakePopup}
                type="button"
                disabled={actionLoading}
                className="bg-[#863545] text-white font-extrabold text-[28px] px-[30px] py-[10px] rounded-[40px] m-[15px] disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

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
        type="button"
        disabled={actionLoading}
        className="bg-[#D9D9D9] mt-[50px] text-black font-extrabold text-[28px] px-[30px] py-[10px] rounded-[40px] disabled:opacity-50"
      >
        Retour à la gestion des stocks
      </button>
    </div>
  );
}

function Input({ value }) {
  return (
    <input
      type="text"
      value={value}
      readOnly
      className="w-[150px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center text-[20px]"
    />
  );
}

export default InfosStocks;