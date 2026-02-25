import { useNavigate } from "react-router-dom";
import plusIcon from "../assets/saisie-stocks-plus.png";

function ModifStocks() {
  const navigate = useNavigate();

  const goToCreer = () => {
    navigate("/creer-stocks"); 
  };

  return (
    <div className="p-4 flex flex-col items-center">

      {/* bouton + */}
      <button className="flex flex-col items-center gap-2 px-[500px] py-[5px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded-[50px]" onClick={goToCreer}>
        <img src={plusIcon} alt="Plus Icon" className="w-[40px] h-[40px] m-[20px]" />
      </button>

    </div>
  );
}

export default ModifStocks;