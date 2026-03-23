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
      localStorage.setItem("token", data.token);
      return data;
    }
    
    if (response.status === 401) throw new Error("Identifiants incorrects");
    if (response.status === 403) throw new Error("Accès refusé");
    throw new Error("Erreur serveur");
  },

  logout: async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`/api/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    } finally {
      localStorage.removeItem("token");
    }
  },

  getToken: () => localStorage.getItem("token")
};