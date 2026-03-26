import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useState, useEffect } from "react";

export const AdminRoute = ({ children }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
    authService.getRole().then(userRole => {
        setRole(userRole);
    });
    }, []);

    if (!authService.isLoggedIn()) return <Navigate to="/auth" replace />;
    if (role !== "ADMIN") return <Navigate to="/palette" replace />; // Redirige les prep vers leur page

    return children;
};

