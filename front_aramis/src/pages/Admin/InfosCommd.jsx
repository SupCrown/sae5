import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InfosCommd() {
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

  const [customers, setCustomers] = useState([]);
  const [supportTypes, setSupportTypes] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [orderResponse, customerResponse, supportTypeResponse, productResponse] =
          await Promise.all([
            fetch(`/api/order/${id}`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`/api/customer/all?page=0&size=200`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`/api/supportType/all?page=0&size=100`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`/api/product/all?page=0&size=200`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        if (!orderResponse.ok) {
          throw new Error("API indisponible");
        }

        const order = await orderResponse.json();

        let customerData = [];
        let supportTypeData = [];
        let productData = [];

        try {
          const customerJson = await customerResponse.json();
          customerData = Array.isArray(customerJson)
            ? customerJson
            : customerJson.content || [];
        } catch {
          customerData = [];
        }

        try {
          const supportTypeJson = await supportTypeResponse.json();
          supportTypeData = Array.isArray(supportTypeJson)
            ? supportTypeJson
            : supportTypeJson.content || [];
        } catch {
          supportTypeData = [];
        }

        try {
          const productJson = await productResponse.json();
          productData = Array.isArray(productJson)
            ? productJson
            : productJson.content || [];
        } catch {
          productData = [];
        }

        setCustomers(customerData);
        setSupportTypes(supportTypeData);
        setProducts(productData);

        const mappedSupports =
          Array.isArray(order.supports) && order.supports.length
            ? order.supports.map((support) => ({
                typeId: support.type?.typeID ?? "",
                products:
                  Array.isArray(support.products) && support.products.length
                    ? support.products.map((product) => ({
                        productID:
                          product.productID ??
                          product.productId ??
                          product.id ??
                          "",
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
        setCustomers([
          { customerID: 101, name: "Client test" },
        ]);
        setSupportTypes([
          { typeID: 1, label: "Palette" },
        ]);
        setProducts([
          { productID: 12, libel: "Produit test" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id]);

  const getCustomerName = (customerID) => {
    if (!customerID) return "";

    const foundCustomer = customers.find(
      (customer) => String(customer.customerID) === String(customerID)
    );

    return foundCustomer?.name || "";
  };

  const getSupportTypeLabel = (typeId) => {
    if (!typeId) return "";

    const foundType = supportTypes.find(
      (type) => String(type.typeID) === String(typeId)
    );

    return foundType?.label || "";
  };

  const getProductLibel = (productID) => {
    if (!productID) return "";

    const foundProduct = products.find(
      (product) =>
        String(product.productID ?? product.id) === String(productID)
    );

    return foundProduct?.libel || "";
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
          Informations d’une commande
        </h2>

        <div className="w-full max-w-[1100px] border border-gray-300 rounded-[30px] p-[30px] bg-[#ffffff]">
          <div className="flex justify-center gap-[30px] flex-wrap">
            <ReadOnlyInput
              label="Date commande"
              value={form.orderDate}
            />

            <div className="flex flex-col items-center">
              <ReadOnlyInput
                label="ID client"
                value={form.customerId}
              />
              {getCustomerName(form.customerId) && (
                <p className="mt-[10px] text-[16px] font-bold text-[#3A0F24]">
                  {getCustomerName(form.customerId)}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <label className="text-[18px] font-bold mb-[12px]">
                Prioritaire
              </label>
              <input
                type="checkbox"
                checked={form.priority}
                readOnly
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
                </div>

                <div className="mb-[20px] flex flex-col items-center">
                  <ReadOnlyInput
                    label="Type ID"
                    value={support.typeId}
                  />

                  {getSupportTypeLabel(support.typeId) && (
                    <p className="mt-[10px] text-[16px] font-bold text-[#3A0F24]">
                      {getSupportTypeLabel(support.typeId)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[15px]">
                  {support.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="flex justify-center items-end gap-[20px] flex-wrap"
                    >
                      <div className="flex flex-col items-center">
                        <ReadOnlyInput
                          label="Product ID"
                          value={product.productID}
                        />

                        {getProductLibel(product.productID) && (
                          <p className="mt-[10px] text-[16px] font-bold text-[#3A0F24]">
                            {getProductLibel(product.productID)}
                          </p>
                        )}
                      </div>

                      <ReadOnlyInput
                        label="Quantité"
                        value={product.quantity}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={goBack}
        className="px-[100px] py-[20px] mt-[40px] text-[20px] font-bold bg-[#D9D9D9] rounded-[50px]"
      >
        Retour à la gestion des commandes
      </button>
    </div>
  );
}

function ReadOnlyInput({ label, value, type = "text" }) {
  return (
    <div className="flex flex-col items-center">
      {label && (
        <label className="text-[18px] font-bold mb-[10px]">{label}</label>
      )}
      <input
        type={type}
        value={value}
        readOnly
        className="w-[180px] px-[18px] py-[18px] border border-gray-300 rounded-[40px] bg-[#CCB5A5] text-center"
      />
    </div>
  );
}

export default InfosCommd;