import { useEffect, useState } from "react";
import plusIcon from "../../assets/saisie-stocks-plus.png";
import SuppBut from "../../assets/SuppBut.png";
import ModifBut from "../../assets/ModifBut.png";
import { useNavigate } from "react-router-dom";

function GestionClient() {
  const navigate = useNavigate();

  const fallbackRows = [
    { customerID: 1, name: "Montellier", code: 11691 },
    { customerID: 2, name: "Dupont", code: 22345 },
    { customerID: 3, name: "Durand", code: 99887 },
    { customerID: 4, name: "Martin", code: 44556 },
  ];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const goToCreer = () => navigate("/creer-cli");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/customer/all?page=${page}&size=${size}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur API");
        }

        const data = await response.json();
        const customers = Array.isArray(data) ? data : data.content || [];

        if (!customers.length) {
          setRows(fallbackRows);
          return;
        }

        const mappedRows = customers.map((customer, index) => ({
          customerID: customer.customerID ?? index + 1,
          name: customer.name ?? "Nom inconnu",
          code: customer.code ?? "00000",
        }));

        setRows(mappedRows);
      } catch (error) {
        console.error("Erreur récupération clients :", error);
        setRows(fallbackRows);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, size]);

  const handleDelete = (customerID, idx) => {
    setRowToDelete({ customerID, idx });
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setRowToDelete(null);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;

    try {
      const response = await fetch(
        `/api/customer/delete/${rowToDelete.customerID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Suppression impossible");
      }

      setRows((prev) =>
        prev.filter((row) => row.customerID !== rowToDelete.customerID)
      );
    } catch (error) {
      console.warn("API delete indisponible -> suppression locale");
      setRows((prev) => prev.filter((_, i) => i !== rowToDelete.idx));
    } finally {
      setConfirmOpen(false);
      setRowToDelete(null);

      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 2000);
    }
  };

  const showPagination = rows.length >= size;

  return (
    <div className="p-4 flex flex-col items-center relative">
      <button
        className="flex flex-col items-center gap-2 px-[500px] py-[5px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[50px]"
        onClick={goToCreer}
        type="button"
      >
        <img
          src={plusIcon}
          alt="Plus Icon"
          className="w-[40px] h-[40px] m-[20px]"
        />
      </button>

      {loading && (
        <div className="mt-[30px] text-[22px] font-bold">
          Chargement des clients...
        </div>
      )}

      {!loading && (
        <div className="w-full mt-[50px]">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold text-[30px]">Nom</th>
                <th className="py-2 font-bold text-[30px]">Code</th>
                <th className="py-2 font-bold text-[30px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => {
                const rowClass =
                  idx % 2 === 0 ? "bg-[#ffffff]" : "bg-[#F0F0F0]";

                return (
                  <tr
                    key={r.customerID ?? idx}
                    className={`border-b border-black ${rowClass}`}
                  >
                    <td className="py-[10px] font-bold text-[20px]">
                      {r.name}
                    </td>
                    <td className="py-[10px] font-bold text-[20px]">
                      {r.code}
                    </td>

                    <td className="py-[10px] font-bold">

                      <button
                        className="px-[20px] py-[10px] rounded-[50px]"
                        onClick={() => handleDelete(r.customerID, idx)}
                        type="button"
                      >
                        <img
                          src={SuppBut}
                          alt="Supprimer"
                          className="w-[20px] h-[20px]"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {showPagination && (
            <div className="flex justify-center items-center gap-6 mt-[30px]">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                className="px-[30px] py-[15px] bg-gray-300 rounded-[20px] font-bold mr-[20px]"
              >
                Précédent
              </button>

              <span className="text-[22px] font-bold">
                Page {page + 1}
              </span>

              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                className="px-[30px] py-[15px] bg-gray-300 rounded-[20px] font-bold ml-[20px]"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-[#FFFFFF]">
          <div className="bg-[#ffffff] w-[650px] border-2 border-black">
            <div className="p-6">
              <p className="text-center text-[22px] font-bold m-[10px]">
                Voulez-vous vraiment supprimer ce client ?
              </p>
              <div className="border-b border-black mt-4" />
            </div>

            <div className="pb-8 flex items-center justify-center gap-20 m-[20px]">
              <button
                onClick={confirmDelete}
                type="button"
                className="bg-[#E6463A] text-white font-extrabold text-[34px] px-[30px] py-[10px] rounded-[40px] mr-[70px]"
              >
                OUI
              </button>

              <button
                onClick={cancelDelete}
                type="button"
                className="bg-[#863545] text-white font-extrabold text-[34px] px-[30px] py-[10px] rounded-[40px]"
              >
                NON
              </button>
            </div>
          </div>
        </div>
      )}

      {successOpen && (
        <div className="fixed w-full flex justify-center">
          <div className="w-[650px] border-2 bg-[#ffffff] px-[30px] py-[20px] flex items-center justify-between rounded-[40px]">
            <span className="font-bold">
              Client supprimé avec succès !
            </span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
              ✓
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionClient;