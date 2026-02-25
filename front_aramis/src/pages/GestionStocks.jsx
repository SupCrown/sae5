import plusIcon from "../assets/saisie-stocks-plus.png";
import SuppBut from "../assets/SuppBut.png";
import ModifBut from "../assets/ModifBut.png";
import { useNavigate } from "react-router-dom";

function GestionStocks() {
  const navigate = useNavigate();

  // Exemple de données (tu peux remplacer par tes données du CSV plus tard)
  const rows = [
    { zone: "H", allee: "08", emplacement: "023" },
    { zone: "H", allee: "08", emplacement: "023" },
    { zone: "H", allee: "08", emplacement: "023" },
    { zone: "H", allee: "08", emplacement: "023" },
  ];

  const goToModif = () => {
    navigate("/modif-stocks"); 
  };

  const goToCreer = () => {
    navigate("/creer-stocks"); 
  };

  return (
    <div className="p-4 flex flex-col items-center">

      {/* bouton + */}
      <button className="flex flex-col items-center gap-2 px-[500px] py-[5px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[50px]" onClick={goToCreer}>
        <img src={plusIcon} alt="Plus Icon" className="w-[40px] h-[40px] m-[20px]" />
      </button>

      {/* tableau */}
      <div className="w-full mt-[50px]">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2 font-bold">Zone</th>
              <th className="py-2 font-bold">Allée</th>
              <th className="py-2 font-bold">Emplacement</th>
              <th className="py-2 font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b border-black">
                <td className="py-[30px] font-bold">{r.zone}</td>
                <td className="py-[30px] font-bold text-blue-600">{r.allee}</td>
                <td className="py-[30px] font-bold">{r.emplacement}</td>
                <td className="py-[30px] font-bold">
                  <button className="px-[20px] py-[10px] text-white rounded-[50px] mr-[10px]" onClick={goToModif}>
                    <img src={ModifBut} alt="Modifier" className="w-[30px] h-[30px]" />
                  </button>
                  <button className="px-[20px] py-[10px] text-white rounded-[50px]">
                    <img src={SuppBut} alt="Supprimer" className="w-[30px] h-[30px]" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default GestionStocks;