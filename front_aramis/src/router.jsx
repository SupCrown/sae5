import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GestionEmpl from "./pages/GestionEmpl.jsx";
import ModifEmpl from "./pages/ModifEmpl.jsx";
import CreerEmpl from "./pages/CreerEmpl.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GestionEmpl /> },
      { path: "gestion-empl", element: <GestionEmpl /> },
      { path: "modif-empl", element: <ModifEmpl /> },
      { path: "creer-empl", element: <CreerEmpl /> },
    ],
  },
]);

export default router;