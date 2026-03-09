import { useNavigate } from "react-router-dom";
import { useState } from "react";
import plusIcon from "../assets/plus-icon.png";
import ModifBut from "../assets/ModifBut.png";
import SuppBut from "../assets/SuppBut.png";

function Stat() {
    const navigate = useNavigate();

    // ✅ rows en state pour pouvoir supprimer visuellement
    const [rows, setRows] = useState([
    { CdeCmd: "H-004-0101-00", nbcolis: "38" },
    { CdeCmd: "H-004-0101-00", nbcolis: "42" },
    { CdeCmd: "H-004-0101-00", nbcolis: "29" },
    { CdeCmd: "H-004-0101-00", nbcolis: "31" },
    ]);

    // ✅ popup confirmation
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);

    // ✅ popup succès
    const [successOpen, setSuccessOpen] = useState(false);

    const goToModif = () => navigate("/modif-commd");
    const goToCreer = () => navigate("/creer-commd");

    // Ouvre le popup confirmation
    const handleDelete = (idx) => {
    setRowToDelete(idx);
    setConfirmOpen(true);
    };

    // Clique NON
    const cancelDelete = () => {
    setConfirmOpen(false);
    setRowToDelete(null);
    };

    // Clique OUI -> supprime + popup succès
    const confirmDelete = () => {
    if (rowToDelete === null) return;

    setRows((prev) => prev.filter((_, i) => i !== rowToDelete));
    setConfirmOpen(false);
    setRowToDelete(null);

    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 2000);
    };

    return (
    <div className="p-4 flex flex-col items-center relative">
        {/* bouton + */}
        <button
        className="flex flex-col items-center gap-2 px-[500px] py-[5px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[50px]"
        onClick={goToCreer}
        type="button"
        >
        <img src={plusIcon} alt="Plus Icon" className="w-[40px] h-[40px] m-[20px]" />
        </button>

        {/* tableau */}
        <div className="w-full mt-[50px]">
        <table className="w-full border-collapse text-center">
            <thead>
            <tr className="border-b-2 border-black">
                <th className="py-2 font-bold text-[30px]">Code Commande</th>
                <th className="py-2 font-bold text-[30px]">Nombre de colis</th>
                <th className="py-2 font-bold text-[30px]">Actions</th>
            </tr>
            </thead>

            <tbody>
            {rows.map((r, idx) => {
                const rowClass = idx % 2 === 0 ? "bg-white" : "bg-[#F0F0F0]";

                return (
                <tr key={idx} className={`border-b border-black ${rowClass}`}>
                    <td className="py-[10px] font-bold text-[20px]">{r.CdeCmd}</td>
                    <td className="py-[10px] font-bold text-[20px]">{r.nbcolis}</td>

                    <td className="py-[10px] font-bold">
                    <button
                        className="px-[20px] py-[10px] rounded-[50px] mr-[10px]"
                        onClick={goToModif}
                        type="button"
                    >
                        <img src={ModifBut} alt="Modifier" className="w-[20px] h-[20px]" />
                    </button>

                    <button
                        className="px-[20px] py-[10px] rounded-[50px]"
                        onClick={() => handleDelete(idx)}
                        type="button"
                    >
                        <img src={SuppBut} alt="Supprimer" className="w-[20px] h-[20px]" />
                    </button>
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>

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
            <span className="font-bold">Commande supprimer avec succès !</span>
            <div className="bg-[#3A0F24] text-[#ffffff] font-bold rounded-[30px] px-[30px] py-[20px]">
                ✓
            </div>
            </div>
        </div>
        )}
    </div>
    );
}


export default Stat;
