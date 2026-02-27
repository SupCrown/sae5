import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GestionEmpl from "./pages/Admin/GestionEmpl.jsx";
import ModifEmpl from "./pages/Admin/ModifEmpl.jsx";
import CreerEmpl from "./pages/Admin/CreerEmpl.jsx";
import GestionPrep from "./pages/Admin/GestionPrep.jsx";
import ModifPrep from "./pages/Admin/ModifPrep.jsx";
import CreerPrep from "./pages/Admin/CreerPrep.jsx";
import GestionCommd from "./pages/Admin/GestionCommd.jsx";
import ModifCommd from "./pages/Admin/ModifCommd.jsx";
import CreerCommd from "./pages/Admin/CreerCommd.jsx";
import SaisieStocks from "./pages/Admin/SaisieStocks.jsx";
import ModifStocks from "./pages/Admin/ModifStocks.jsx";
import GestionStocks from "./pages/Admin/GestionStocks.jsx";
import CreerStocks from "./pages/Admin/CreerStocks.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GestionPrep /> },
      { path: "gestion-prep", element: <GestionPrep /> },
      { path: "modif-prep", element: <ModifPrep /> },
      { path: "creer-prep", element: <CreerPrep /> },
      { path: "gestion-empl", element: <GestionEmpl /> },
      { path: "modif-empl", element: <ModifEmpl /> },
      { path: "creer-empl", element: <CreerEmpl /> },
      { path: "gestion-commd", element: <GestionCommd /> },
      { path: "modif-commd", element: <ModifCommd /> },
      { path: "creer-commd", element: <CreerCommd /> },
      { path: "saisie-stocks", element: <SaisieStocks /> },
      { path: "modif-stocks", element: <ModifStocks /> },
      { path: "gestion-stocks", element: <GestionStocks /> },
      { path: "creer-stocks", element: <CreerStocks /> },
    ],
  },
]);

export default router;