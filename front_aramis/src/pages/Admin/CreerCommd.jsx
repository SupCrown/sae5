import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assets/saisie-stocks-plus.png";

function CreerCommd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    orderDate: "",
    customerID: "",
    priority: false,
    supports: [
      {
        typeId: "",
        products: [
          {
            productID: "",
            quantity: "",
          },
        ],
      },
    ],
  });

  const [manualLoading, setManualLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
      navigate("/gestion-commd");
    }, 1500);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  const closeErrorPopup = () => {
    setErrorOpen(false);
  };

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSupportChange = (supportIndex, field, value) => {
    setForm((prev) => {
      const updatedSupports = [...prev.supports];
      updatedSupports[supportIndex] = {
        ...updatedSupports[supportIndex],
        [field]: value,
      };

      return {
        ...prev,
        supports: updatedSupports,
      };
    });
  };

  const handleProductChange = (supportIndex, productIndex, field, value) => {
    setForm((prev) => {
      const updatedSupports = [...prev.supports];
      const updatedProducts = [...updatedSupports[supportIndex].products];

      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [field]: value,
      };

      updatedSupports[supportIndex] = {
        ...updatedSupports[supportIndex],
        products: updatedProducts,
      };

      return {
        ...prev,
        supports: updatedSupports,
      };
    });
  };

  const addSupport = () => {
    setForm((prev) => ({
      ...prev,
      supports: [
        ...prev.supports,
        {
          typeId: "",
          products: [
            {
              productID: "",
              quantity: "",
            },
          ],
        },
      ],
    }));
  };

  const removeSupport = (supportIndex) => {
    setForm((prev) => ({
      ...prev,
      supports: prev.supports.filter((_, index) => index !== supportIndex),
    }));
  };

  const addProduct = (supportIndex) => {
    setForm((prev) => {
      const updatedSupports = [...prev.supports];
      updatedSupports[supportIndex] = {
        ...updatedSupports[supportIndex],
        products: [
          ...updatedSupports[supportIndex].products,
          {
            productID: "",
            quantity: "",
          },
        ],
      };

      return {
        ...prev,
        supports: updatedSupports,
      };
    });
  };

  const removeProduct = (supportIndex, productIndex) => {
    setForm((prev) => {
      const updatedSupports = [...prev.supports];
      updatedSupports[supportIndex] = {
        ...updatedSupports[supportIndex],
        products: updatedSupports[supportIndex].products.filter(
          (_, index) => index !== productIndex
        ),
      };

      return {
        ...prev,
        supports: updatedSupports,
      };
    });
  };

  const validateManualForm = () => {
    if (!form.orderDate || !form.customerID || form.supports.length === 0) {
      return false;
    }

    for (const support of form.supports) {
      if (!support.typeId || support.products.length === 0) {
        return false;
      }

      for (const product of support.products) {
        if (!product.productID || !product.quantity) {
          return false;
        }
      }
    }

    return true;
  };

  const extractBackendMessage = async (response, defaultMessage) => {
    try {
      const data = await response.json();
      return (
        data?.message ||
        data?.error ||
        data?.details ||
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

  const handleCreateManual = async () => {
    setErrorMessage("");
    setErrorOpen(false);

    if (!validateManualForm()) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      orderDate: form.orderDate,
      customerID: Number(form.customerID),
      priority: form.priority,
      supports: form.supports.map((support) => ({
        typeId: Number(support.typeId),
        products: support.products.map((product) => ({
          productID: Number(product.productID),
          quantity: Number(product.quantity),
        })),
      })),
    };

    try {
      setManualLoading(true);

      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const message = await extractBackendMessage(
          response,
          "Création de la commande impossible."
        );
        throw new Error(message);
      }

      showSuccess("Commande créée avec succès !");
    } catch (error) {
      console.warn("Erreur création commande :", error);

      let message = error.message || "Erreur lors de la création de la commande.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message =
          "Erreur serveur. Vérifiez les informations de la commande.";
      }

      showError(message);
    } finally {
      setManualLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isCsv =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      showError("Veuillez sélectionner un fichier CSV.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleImportCsv = async () => {
    if (!selectedFile) {
      showError("Veuillez d'abord sélectionner un fichier CSV.");
      return;
    }

    try {
      setImportLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/order/import", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const message = await extractBackendMessage(
          response,
          "Import CSV impossible."
        );
        throw new Error(message);
      }

      showSuccess("Import CSV réussi !");
    } catch (error) {
      console.warn("Erreur import commande :", error);

      let message = error.message || "Erreur lors de l’import CSV.";

      if (
        message.toLowerCase().includes("internal") ||
        message.toLowerCase().includes("500")
      ) {
        message = "Erreur serveur pendant l’import du fichier CSV.";
      }

      showError(message);
    } finally {
      setImportLoading(false);
    }
  };

  const goBack = () => navigate("/gestion-commd");

  return (
    <div className="p-4 flex flex-col items-center mt-[60px] relative">
      <div className="w-[1400px] flex flex-col items-center">
        <h2 className="text-[28px] font-[800] mb-[25px]">
          Création manuelle d’une commande
        </h2>

        <div className="w-full max-w-[1100px] border border-gray-300 rounded-[30px] p-[30px] bg-[#ffffff]">
          <div className="flex justify-center gap-[30px] flex-wrap">
            <Input
              label="Date commande"
              name="orderDate"
              type="date"
              value={form.orderDate}
              onChange={handleMainChange}
            />

            <Input
              label="ID client"
              name="customerID"
              type="number"
              value={form.customerID}
              onChange={handleMainChange}
            />

            <div className="flex flex-col items-center justify-center">
              <label className="text-[18px] font-bold mb-[12px]">
                Prioritaire
              </label>
              <input
                type="checkbox"
                name="priority"
                checked={form.priority}
                onChange={handleMainChange}
                className="w-[28px] h-[28px]"
              />
            </div>
          </div>

          <div className="mt-[35px]">
            {form.supports.map((support, supportIndex) => (
              <div
                key={supportIndex}
                className="mb-[30px] border border-gray-300 rounded-[25px] p-[20px] bg-[#f8f8f8]"
              >
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="text-[22px] font-bold">
                    Support {supportIndex + 1}
                  </h3>

                  {form.supports.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSupport(supportIndex)}
                      className="px-[25px] py-[10px] rounded-[30px] bg-[#D9D9D9] font-bold"
                    >
                      Supprimer le support
                    </button>
                  )}
                </div>

                <div className="mb-[20px]">
                  <Input
                    label="Type ID"
                    type="number"
                    value={support.typeId}
                    onChange={(e) =>
                      handleSupportChange(supportIndex, "typeId", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-[15px]">
                  {support.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="flex justify-center items-end gap-[20px] flex-wrap"
                    >
                      <Input
                        label="Product ID"
                        type="number"
                        value={product.productID}
                        onChange={(e) =>
                          handleProductChange(
                            supportIndex,
                            productIndex,
                            "productID",
                            e.target.value
                          )
                        }
                      />

                      <Input
                        label="Quantité"
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductChange(
                            supportIndex,
                            productIndex,
                            "quantity",
                            e.target.value
                          )
                        }
                      />

                      {support.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeProduct(supportIndex, productIndex)
                          }
                          className="px-[25px] py-[18px] rounded-[30px] bg-[#D9D9D9] font-bold"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-[20px]">
                  <button
                    type="button"
                    onClick={() => addProduct(supportIndex)}
                    className="px-[35px] py-[15px] rounded-[35px] bg-[#CCB5A5] font-bold"
                  >
                    + Ajouter un produit
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addSupport}
                className="px-[40px] py-[18px] rounded-[35px] bg-[#CCB5A5] font-bold text-[18px]"
              >
                + Ajouter un support
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateManual}
          disabled={manualLoading}
          className="px-[100px] py-[20px] mt-[35px] text-[20px] font-[800] rounded-[50px] bg-[#CCB5A5] disabled:opacity-50"
        >
          {manualLoading ? "Création..." : "Créer à la main"}
        </button>

        <h2 className="text-[28px] font-[800] mt-[60px] mb-[20px]">
          Import d’une commande par CSV
        </h2>

        <label className="font-[800] text-[20px]">
          Ajouter un fichier CSV
        </label>

        <button
          onClick={handleClick}
          type="button"
          className="flex flex-col items-center gap-2 px-[220px] py-[60px] mt-[30px] text-[20px] font-bold rounded-[40px] bg-[#D9D9D9]"
        >
          {fileName ? (
            <span>{fileName}</span>
          ) : (
            <img
              src={plusIcon}
              alt="Plus Icon"
              className="w-[52px] h-[52px] m-[20px]"
            />
          )}
        </button>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          onClick={handleImportCsv}
          disabled={importLoading}
          className="flex flex-col items-center gap-2 px-[100px] py-[30px] mt-[40px] text-[20px] font-[800] rounded-[80px] bg-[#D9D9D9] disabled:opacity-50"
        >
          {importLoading ? "Import..." : "Importer le CSV"}
        </button>
      </div>

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
                className="bg-[#863545] text-white font-extrabold text-[28px] px-[40px] py-[12px] rounded-[40px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={goBack}
        className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#D9D9D9] rounded-[50px]"
      >
        Retour à la gestion des commandes
      </button>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col items-center">
      {label && (
        <label className="text-[18px] font-bold mb-[10px]">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="..."
        className="w-[180px] px-[18px] py-[18px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center"
      />
    </div>
  );
}

export default CreerCommd;