import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();

  if (!token) {
    return <Navigate replace to="/auth" />;
  }

  return children;
};