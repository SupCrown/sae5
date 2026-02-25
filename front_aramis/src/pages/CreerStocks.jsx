import { useNavigate } from "react-router-dom";

function CreerStocks() {

  return (
    <div className="p-4 mt-[200px] flex flex-col items-center">

      {/* conteneur commun centré */}
      <div className="w-[800px] flex flex-col items-center">

        {/* TABLEAU */}
        <table className="text-center border-collapse ml-[45px]">
          <thead>
            <tr>
              <th className="text-[30px] font-bold px-[60px] pb-[20px]">Zone</th>
              <th className="text-[30px] font-bold px-[60px] pb-[20px]">Allée</th>
              <th className="text-[30px] font-bold px-[60px] pb-[20px]">Emplacement</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-[40px]">
                <input
                  type="text"
                  placeholder="..."
                  className="w-[180px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[40px]">
                <input
                  type="text"
                  placeholder="..."
                  className="w-[180px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>

              <td className="px-[40px]">
                <input
                  type="text"
                  placeholder="..."
                  className="w-[180px] px-[20px] py-[20px] border border-gray-300 rounded-[50px] bg-[#CCB5A5] text-center"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* BOUTON */}
        <button
          className="px-[100px] py-[20px] mt-[40px] text-[20px] font-[800] bg-[#CCB5A5] rounded-[50px]"
        >
          Créer
        </button>

      </div>
    </div>
  );
}

export default CreerStocks;