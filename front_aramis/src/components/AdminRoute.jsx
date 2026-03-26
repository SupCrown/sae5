import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const AdminRoute = ({ children }) => {
  const token = authService.getToken();
  const role = authService.getRole();

  if (!token) return <Navigate to="/auth" replace />;
  if (role !== "admin") return <Navigate to="/palette" replace />; // Redirige les prep vers leur page

  return children;
};

