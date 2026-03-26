import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const ProtectedRoute = ({ children }) => {
  // On récupère le token directement (c'est instantané avec localStorage)
  const token = authService.getToken();

  // Si le token n'existe pas, on redirige vers l'authentification
  if (!token) {
    return <Navigate replace to="/auth" />;
  }

  // Si le token existe, on affiche la page demandée
  return children;
};