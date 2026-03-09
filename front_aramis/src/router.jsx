import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import SaisieStocks from "./pages/SaisieStocks.jsx";
import ModifStocks from "./pages/ModifStocks.jsx";
import GestionStocks from "./pages/GestionStocks.jsx";
import CreerStocks from "./pages/CreerStocks.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <SaisieStocks /> },
      { path: "gestion-stocks", element: <GestionStocks /> },
      { path: "modif-stocks", element: <ModifStocks /> },
      { path: "creer-stocks", element: <CreerStocks /> },
    ],
  },
]);

export default router;