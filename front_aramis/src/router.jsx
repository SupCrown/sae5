import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GestionPrep from "./pages/GestionPrep.jsx";
import CreerPrep from "./pages/CreerPrep.jsx";
import ModifPrep from "./pages/ModifPrep.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GestionPrep /> },
      { path: "gestion-prep", element: <GestionPrep /> },
      { path: "modif-prep", element: <ModifPrep /> },
      { path: "creer-prep", element: <CreerPrep /> },
    ],
  },
]);

export default router;