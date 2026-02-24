import plusIcon from "../assets/saisie-stocks-plus.png";

function SaisieStocks() {
  

  return (
    <div className="p-4">
        <button className="flex flex-col items-center gap-2 px-[400px] py-[100px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded border-grey bg-grey-200">
            <label>Saisie des stocks</label>
            {/*<img src={plusIcon} alt="Saisie des stocks"/>*/}
        </button>

        <button className="flex flex-col items-center gap-2 px-[400px] py-[100px] mt-[40px] text-[20px] font-bold bg-blue-600 text-white rounded border-grey bg-grey-200">Créer / modifier</button>
    </div>
  );
}

