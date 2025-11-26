import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);

  // 🔹 Récupère l'email utilisateur depuis les cookies
  useEffect(() => {
    const cookie = document.cookie.split("; ").find((r) => r.startsWith("userData="));
    if (cookie) {
      const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      if (userData?.email) setUserEmail(userData.email);
    }
  }, []);

  // 🔹 Charge le nombre d'articles du panier
  const fetchCartCount = async () => {
    if (!userEmail) return;
    try {
      const res = await api.get(`/cart/?email=${userEmail}`);
      if (res.data && res.data.length > 0) {
        const cart = res.data[0];
        const total = cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Erreur récupération panier :", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [userEmail]);

  // 🔹 Ajout au panier → on rafraîchit le badge
  const addToCart = async (itemId) => {
    try {
      await api.post("/cart/add/", { email: userEmail, item_id: itemId });
      await fetchCartCount();
    } catch (err) {
      console.error("Erreur ajout au panier :", err);
    }
  };

  // 🔹 Suppression → on rafraîchit le badge
  const removeFromCart = async (itemId) => {
    try {
      await api.delete("/cart/remove/", {
        data: { email: userEmail, item_id: itemId },
      });
      await fetchCartCount();
    } catch (err) {
      console.error("Erreur suppression panier :", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
