import { log } from "three";

export const authService = {
  login: async (pin) => {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: parseInt(pin, 10) }),
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    if (response.status === 401) throw new Error("Identifiants incorrects");
    if (response.status === 403) throw new Error("Accès refusé");
    throw new Error("Erreur serveur");
  },

  logout: async () => {
    try {
      await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  },

  isLoggedIn: async() => {
      try {
      const response = await fetch('/api/authStatus', {
        method: 'GET',
        credentials: 'include', 
      });

      // Renvoie true si 200, false pour 401, 403, 404, 500, etc.
      return response.ok; 
    } catch (error) {
      console.error("Erreur lors de la vérification de l'auth:", error);
      return false;
    }
  },
  getRole: async () => {
    try {
      const response = await fetch('/api/getRole', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return "USER"; // Si l'API répond une erreur (ex: 401), on met USER par défaut
      }

      const data = await response.json();
      
      // On retourne DIRECTEMENT la valeur reçue
      return data.role || "USER"; 

    } catch (error) {
      console.error("Erreur lors de la récupération du rôle:", error);
      return "USER"; // En cas de crash réseau, sécurité d'abord : USER
    }
  }
};