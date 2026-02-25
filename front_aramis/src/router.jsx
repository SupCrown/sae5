import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GestionCommd from "./pages/GestionCommd.jsx";
import ModifCommd from "./pages/ModifCommd.jsx";
import CreerCommd from "./pages/CreerCommd.jsx";
  

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GestionCommd /> },
      { path: "gestion-commd", element: <GestionCommd /> },
      { path: "modif-commd", element: <ModifCommd /> },
      { path: "creer-commd", element: <CreerCommd /> },
    ],
  },
]);

export default router;