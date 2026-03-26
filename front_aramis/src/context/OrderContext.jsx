import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const preparateurId = localStorage.getItem("preparateurId") || 1;
      
      const response = await fetch(`/api/order/autoAssign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preparateurId })
      });

      if (response.status === 200 || response.status === 307) {
        const data = await response.json();
        setCurrentOrder(data); // Contient l'orderId et la première étape
      } else if (response.status === 204) {
        setCurrentOrder(null); // Pas de commande disponible
      }
    } catch (err) {
      setError("Erreur de connexion serveur");
    } finally {
      setLoading(false);
    }
  };

  // 2. Passer à l'étape suivante (ou signaler un manque)
  const validateStep = async (missingItem = false) => {
    if (!currentOrder) return;

    try {
      const response = await fetch(
        `http://147.93.55.68/order/nextStep?orderId=${currentOrder.orderId}${missingItem ? `&missingItem=true` : ''}`,
        { method: 'POST' }
      );
      
      const nextData = await response.json();
      setCurrentOrder(nextData); 
      return nextData;
    } catch (err) {
      console.error("Erreur lors de l'étape suivante:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadOrder(); // Ne s'exécute que si on est connecté
    }
  }, []);

  return (
    <OrderContext.Provider value={{ currentOrder, loading, error, validateStep, reloadOrder: loadOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);