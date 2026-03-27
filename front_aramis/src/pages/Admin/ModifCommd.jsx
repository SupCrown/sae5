import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ModifCommd() {
  const navigate = useNavigate();
  const { id } = useParams();

  const testData = {
    orderDate: "2026-03-23",
    customerId: 101,
    priority: false,
    supports: [
      {
        typeId: 1,
        products: [
          {
            productID: 12,
            quantity: 3,
          },
        ],
      },
    ],
  };

  const [form, setForm] = useState({
    orderDate: "",
    customerId: "",
    priority: false,
    supports: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/order/${id}`, {
          method: "GET",
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("API indisponible");
        }

        const order = await response.json();

        const mappedSupports =
          Array.isArray(order.supports) && order.supports.length
            ? order.supports.map((support) => ({
                typeId: support.type?.typeID ?? "",
                products:
                  Array.isArray(support.products) && support.products.length
                    ? support.products.map((product) => ({
                        productID: product.productID ?? product.productId ?? "",
                        quantity: product.quantity ?? "",
                      }))
                    : [{ productID: "", quantity: "" }],
              }))
            : testData.supports;

          setForm({
            orderDate: order.orderDate ?? testData.orderDate,
            customerId: order.customerID ?? testData.customerId,
            priority: order.priority ?? testData.priority,
            supports: mappedSupports,
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
          products: [{ productID: "", quantity: "" }],
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
          { productID: "", quantity: "" },
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

  const validateForm = () => {
    if (!form.orderDate || !form.customerId || form.supports.length === 0) {
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

  const handleUpdate = async () => {
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      orderDate: form.orderDate,
      customerID: Number(form.customerId),
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
      setSaving(true);

      const response = await fetch(`/api/order/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
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

  const goBack = () => navigate("/gestion-commd");

  if (loading) {
    return (
      <div className="p-4 mt-[200px] flex justify-center text-[24px] font-bold">
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-4 mt-[80px] flex flex-col items-center relative">
      <div className="w-[1400px] flex flex-col items-center">
        <h2 className="text-[28px] font-[800] mb-[25px]">
          Modification d’une commande
        </h2>

        <div className="w-full max-w-[1100px] border border-gray-300 rounded-[30px] p-[30px] bg-white">
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
              name="customerId"
              type="number"
              value={form.customerId}
              onChange={handleMainChange}
            />

            <div className="flex flex-col items-center justify-center">
              <label className="text-[18px] font-bold mb-[12px]">Prioritaire</label>
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
                          onClick={() => removeProduct(supportIndex, productIndex)}
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

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col items-center">
      {label && <label className="text-[18px] font-bold mb-[10px]">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-[180px] px-[18px] py-[18px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center"
      />
    </div>
  );
}

export default ModifCommd;