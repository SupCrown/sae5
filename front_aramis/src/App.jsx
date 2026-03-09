import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate(); 

  const goToPrep = () => navigate("/gestion-prep");
  const goToEmpl = () => navigate("/gestion-empl");
  const goToCommd = () => navigate("/gestion-commd*");
  const goToStocks = () => navigate("/saisie-stocks");

  return (
    <div>
       <header
        style={{
          padding: "16px",
          borderBottom: "10px solid #AD211B", 
          textAlign: "center",
        }}
      >
        <select>
          <option value="gestion-prep" onClick={goToPrep}>Gestion Préparateurs</option>
          <option value="gestion-empl" onClick={goToEmpl}>Gestion Emplacements</option>
          <option value="gestion-commd" onClick={goToCommd}>Gestion Commandes</option>
          <option value="saisie-stocks" onClick={goToStocks}>Saisie Stocks</option>
        </select>
      </header>
      {/* header / navbar etc */}
      <Outlet />
    </div>
  );
}