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
import GestionStocks from "./pages/Admin/GestionStocks.jsx";
import CreerStocks from "./pages/Admin/CreerStocks.jsx";
import InfosStocks from "./pages/Admin/InfosStocks.jsx";
import Stat from "./pages/Admin/Stat.jsx";
import Listen from "./pages/ListenPage.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GestionPrep /> },
      { path: "gestion-prep", element: <GestionPrep /> },
      { path: "modif-prep/:id", element: <ModifPrep /> },
      { path: "creer-prep", element: <CreerPrep /> },
      { path: "gestion-empl", element: <GestionEmpl /> },
      { path: "modif-empl/:id", element: <ModifEmpl /> },
      { path: "creer-empl", element: <CreerEmpl /> },
      { path: "gestion-commd", element: <GestionCommd /> },
      { path: "modif-commd/:id", element: <ModifCommd /> },
      { path: "creer-commd", element: <CreerCommd /> },
      { path: "gestion-stocks", element: <GestionStocks /> },
      { path: "creer-stocks", element: <CreerStocks /> },
      { path: "infos-stocks/:id", element: <InfosStocks />},
      { path: "stat", element: <Stat /> },
      { path: "listen", element: <Listen /> },
    ],
  },
]);

export default router;