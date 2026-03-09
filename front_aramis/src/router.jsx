import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Stat from "./pages/Stat.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Stat /> },
      { path: "stat", element: <Stat /> },
    ],
  },
]);

export default router;