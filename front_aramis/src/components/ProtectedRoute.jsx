import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    authService.isLoggedIn()
      .then((data) => {
        setIsLoggedIn(data);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  if (isLoggedIn === null) {
    return <div>Vérification de l'authentification...</div>; 
  }
  if (!isLoggedIn) {
    return <Navigate replace to="/auth" />;
  }


  return children;
};

