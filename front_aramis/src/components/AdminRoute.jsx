import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useState, useEffect } from "react";

export default function AdminRoute ({ children }){
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        authService.getRole().then(userRole => {
            setRole(userRole);
        });
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
    if (!isLoggedIn) return <Navigate to="/auth" replace />;

    if (role === null) {
        return <div>Vérification de l'authentification...</div>; 
    }
    if (role !== "ADMIN") return <Navigate to="/gestion-prep" replace />; // Redirige les prep vers leur page

    return children;
};

