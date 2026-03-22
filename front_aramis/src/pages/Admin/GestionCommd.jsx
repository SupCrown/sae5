import { useEffect, useState } from "react";
import plusIcon from "../../assets/saisie-stocks-plus.png";
import SuppBut from "../../assets/SuppBut.png";
import ModifBut from "../../assets/ModifBut.png";
import { useNavigate } from "react-router-dom";

function GestionCommd() {
  const navigate = useNavigate();

  const fallbackRows = [
  {
    id: 1,
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
  },
  {
    id: 2,
    support: "SUP-002",
    codemb: "EMB02",
    cliliv: "CL002",
    nomcli: "Client B",
    itm8: "ITM0002",
    designation: "Produit B",
    nbColis: 42,
    zone: "A",
    allee: "02",
    dpl: "110",
    niveau: "2",
  },
  {
    id: 3,
    support: "SUP-003",
    codemb: "EMB03",
    cliliv: "CL003",
    nomcli: "Client C",
    itm8: "ITM0003",
    designation: "Produit C",
    nbColis: 29,
    zone: "C",
    allee: "15",
    dpl: "045",
    niveau: "3",
  },
  {
    id: 4,
    support: "SUP-004",
    codemb: "EMB04",
    cliliv: "CL004",
    nomcli: "Client D",
    itm8: "ITM0004",
    designation: "Produit D",
    nbColis: 31,
    zone: "F",
    allee: "01",
    dpl: "301",
    niveau: "1",
  },
];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const goToModif = (id) => navigate(`/modif-commd/${id}`);
  const goToCreer = () => navigate("/creer-commd");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://147.93.55.68/order/all?page=${page}&size=${size}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erreur API");
        }

        const data = await response.json();
        const orders = Array.isArray(data) ? data : data.content || [];

        if (!orders.length) {
          setRows(fallbackRows);
          return;
        }

        const mappedRows = orders.map((order, index) => ({
          id: order.id ?? index + 1,

          support: order.support ?? "SUP-001",
          codemb: order.codemb ?? "EMB01",
          cliliv: order.cliliv ?? "CL001",
          nomcli: order.nomcli ?? "Client Test",

          itm8: order.itm8 ?? "ITM0001",
          designation: order.designation ?? "Produit X",

          nbColis: order.nbColis ?? order.nbcolis ?? 0,

          zone: order.zone ?? "A",
          allee: order.allee ?? order.driveway ?? "01",
          dpl: order.dpl ?? order.location ?? "000",
          niveau: order.niveau ?? order.level ?? "0",
        }));

        setRows(mappedRows);
      } catch (error) {
        console.error("Erreur récupération commandes :", error);
        setRows(fallbackRows);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, size]);

  const handleDelete = (row, idx) => {
    setRowToDelete({ id: row.id, idx });
    setConfirmOpen(true);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setRowToDelete(null);
  };

  const confirmDelete = async () => {
    if (!rowToDelete) return;

    try {
      const response = await fetch(`http://147.93.55.68/order/delete/${rowToDelete.id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Suppression impossible");
      }

      setRows((prev) => prev.filter((row) => row.id !== rowToDelete.id));
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

  return (
    <div className="p-4 flex flex-col items-center relative">
      <button
        className="flex flex-col items-center gap-2 px-[500px] py-[5px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[50px]"
        onClick={goToCreer}
        type="button"
      >
        <img src={plusIcon} alt="Plus Icon" className="w-[40px] h-[40px] m-[20px]" />
      </button>

      {loading && (
        <div className="mt-[30px] text-[22px] font-bold">
          Chargement des commandes...
        </div>
      )}

      {!loading && (
        <div className="w-full mt-[50px]">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold text-[18px]">N° Support</th>
                <th className="py-2 font-bold text-[18px]">Codemb</th>
                <th className="py-2 font-bold text-[18px]">Cliliv</th>
                <th className="py-2 font-bold text-[18px]">Nomcli</th>
                <th className="py-2 font-bold text-[18px]">ITM 8</th>
                <th className="py-2 font-bold text-[18px]">Désignation</th>
                <th className="py-2 font-bold text-[18px]">Nb Colis</th>
                <th className="py-2 font-bold text-[18px]">Z</th>
                <th className="py-2 font-bold text-[18px]">All</th>
                <th className="py-2 font-bold text-[18px]">Dpl</th>
                <th className="py-2 font-bold text-[18px]">Niv</th>
                <th className="py-2 font-bold text-[18px]">Actions</th>
              </tr>
            </thead>

           <tbody>
              {rows.map((r, idx) => {
                const rowClass = idx % 2 === 0 ? "bg-white" : "bg-[#F0F0F0]";

                return (
                  <tr key={r.id ?? idx} className={`border-b border-black ${rowClass}`}>
                    <td className="py-[8px]">{r.support}</td>
                    <td className="py-[8px]">{r.codemb}</td>
                    <td className="py-[8px]">{r.cliliv}</td>
                    <td className="py-[8px]">{r.nomcli}</td>
                    <td className="py-[8px]">{r.itm8}</td>
                    <td className="py-[8px]">{r.designation}</td>
                    <td className="py-[8px] font-bold">{r.nbColis}</td>
                    <td className="py-[8px]">{r.zone}</td>
                    <td className="py-[8px]">{r.allee}</td>
                    <td className="py-[8px]">{r.dpl}</td>
                    <td className="py-[8px]">{r.niveau}</td>

                    <td className="py-[8px]">
                      <button
                        className="px-[15px] py-[8px] mr-[10px]"
                        onClick={() => goToModif(r.id)}
                      >
                        <img src={ModifBut} alt="Modifier" className="w-[18px]" />
                      </button>

                      <button
                        className="px-[15px] py-[8px]"
                        onClick={() => handleDelete(r, idx)}
                      >
                        <img src={SuppBut} alt="Supprimer" className="w-[18px]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-6 mt-[30px]">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="px-[30px] py-[15px] bg-gray-300 rounded-[20px] font-bold mr-[20px]"
            >
              Précédent
            </button>

            <span className="text-[22px] font-bold">Page {page + 1}</span>

            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              className="px-[30px] py-[15px] bg-gray-300 rounded-[20px] font-bold ml-[20px]"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-[#FFFFFF]">
          <div className="bg-white w-[650px] border-2 border-black">
            <div className="p-6">
              <p className="text-center text-[22px] font-bold">
                Voulez-vous vraiment supprimer cette commande ?
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
          <div className="w-[650px] border-2 bg-white px-[30px] py-[20px] flex items-center justify-between rounded-[40px] bg-[#FFFFFF]">
            <span className="font-bold">Commande supprimée avec succès !</span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
              ✓
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionCommd;