import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pour injecter la commande depuis DataLoading
  const setOrderManually = (orderData) => {
    setCurrentOrder(orderData);
  };

  // Validation de l'étape (Update commande)
  const validateStep = async (missingItem = false) => {
    if (!currentOrder) return;

    try {
      // Respect de la spec : /order/nextStep?orderID=xxx&missingItem=yyy en GET
      const response = await fetch(
        `/api/order/nextStep?orderID=${currentOrder.orderID}&missingItem=${missingItem}`,
        { method: 'GET' }
      );
      
      if (!response.ok) throw new Error("Erreur mise à jour étape");
      
      const nextData = await response.json();
      setCurrentOrder(nextData); 
      return nextData;
    } catch (err) {
      console.error("Erreur nextStep:", err);
      setError("Impossible de charger l'étape suivante");
    }
  };

  return (
    <OrderContext.Provider value={{ 
      currentOrder, 
      loading, 
      error, 
      validateStep, 
      setOrderManually 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);