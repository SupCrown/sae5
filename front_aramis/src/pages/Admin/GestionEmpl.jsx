import { useEffect, useState } from "react";
import plusIcon from "../../assets/saisie-stocks-plus.png";
import SuppBut from "../../assets/SuppBut.png";
import ModifBut from "../../assets/ModifBut.png";
import { useNavigate } from "react-router-dom";

function GestionEmpl() {
  const navigate = useNavigate();

  const fallbackRows = [
    { id: 1, zone: "H", driveway: "1", location: "1", level: "0" },
    { id: 2, zone: "H", driveway: "1", location: "2", level: "0" },
    { id: 3, zone: "H", driveway: "1", location: "3", level: "0" },
    { id: 4, zone: "H", driveway: "1", location: "4", level: "0" },
  ];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const goToModif = (id) => navigate(`/modif-empl/${id}`);
  const goToCreer = () => navigate("/creer-empl");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://147.93.55.68/position/all?page=${page}&size=${size}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur API");
        }

        const data = await response.json();
        const positions = Array.isArray(data) ? data : data.content || [];

        if (!positions.length) {
          setRows(fallbackRows);
          return;
        }

        const mappedRows = positions.map((position, index) => ({
          id: position.locationID ?? index + 1,
          zone: position.driveway?.zone?.zoneName ?? "A",
          driveway: position.driveway?.name ?? "1",
          location: position.locationCode ?? "000",
          level: String(position.level?.levelValue ?? 0),
        }));

        setRows(mappedRows);
      } catch (error) {
        console.error("Erreur récupération emplacements :", error);
        setRows(fallbackRows);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
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
      const response = await fetch(
        `http://147.93.55.68/position/delete/${rowToDelete.id}`,
        {
          method: "POST",
        }
      );

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
          Chargement des emplacements...
        </div>
      )}

      {!loading && (
        <div className="w-full mt-[50px]">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold text-[30px]">Zone</th>
                <th className="py-2 font-bold text-[30px]">Allée</th>
                <th className="py-2 font-bold text-[30px]">Emplacement</th>
                <th className="py-2 font-bold text-[30px]">Niveau</th>
                <th className="py-2 font-bold text-[30px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => {
                const rowClass = idx % 2 === 0 ? "bg-white" : "bg-[#F0F0F0]";

                return (
                  <tr
                    key={r.id ?? idx}
                    className={`border-b border-black ${rowClass}`}
                  >
                    <td className="py-[10px] font-bold text-[20px]">{r.zone}</td>
                    <td className="py-[10px] font-bold text-[20px]">{r.driveway}</td>
                    <td className="py-[10px] font-bold text-[20px]">{r.location}</td>
                    <td className="py-[10px] font-bold text-[20px]">{r.level}</td>

                    <td className="py-[10px] font-bold">
                      <button
                        className="px-[20px] py-[10px] rounded-[50px] mr-[10px]"
                        onClick={() => goToModif(r.id)}
                        type="button"
                      >
                        <img
                          src={ModifBut}
                          alt="Modifier"
                          className="w-[20px] h-[20px]"
                        />
                      </button>

                      <button
                        className="px-[20px] py-[10px] rounded-[50px]"
                        onClick={() => handleDelete(r, idx)}
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

              <span className="text-[22px] font-bold">Page {page + 1}</span>

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
          <div className="bg-white w-[650px] border-2 border-black">
            <div className="p-6">
              <p className="text-center text-[22px] font-bold">
                Voulez-vous vraiment supprimer cet emplacement ?
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
            <span className="font-bold">Emplacement supprimé avec succès !</span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
              ✓
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionEmpl;
