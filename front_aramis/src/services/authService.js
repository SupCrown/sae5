const API_URL = "http://147.93.55.68";

export const authService = {
  login: async (pin) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: parseInt(pin, 10) }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      
      // Stockage des informations essentielles
      localStorage.setItem("token", data.token);
      
      // On stocke le PIN comme PreparateurID pour l'appel autoAssign
      localStorage.setItem("PreparateurID", pin);
      
      // On stocke un nom d'affichage (utilisé dans RecupCommande)
      const isAdmin = pin === "421";
      localStorage.setItem("userRole", isAdmin ? "admin" : "prep");
      localStorage.setItem("username", isAdmin ? "Administrateur" : `Préparateur ${pin}`);
      
      return data;
    }
    
    if (response.status === 401) throw new Error("Identifiants incorrects");
    if (response.status === 403) throw new Error("Accès refusé");
    throw new Error("Erreur serveur");
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include',
      });
    } catch (err) {
      console.warn("Serveur injoignable, nettoyage local uniquement.");
    } finally {
      // Nettoyage complet
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("PreparateurID");
      localStorage.removeItem("username");
    }
  },

  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("userRole")
};