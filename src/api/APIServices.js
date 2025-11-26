import api from "./axiosConfig";

// 🛒 Ajouter un article au panier
export const addToCart = async (email, item_id, quantity = 1) => {
  return await api.post("/cart/add/", { email, item_id, quantity });
};

// 📦 Récupérer le panier
export const fetchCart = async (email) => {
  return await api.get(`/cart/?email=${email}`);
};

// 🗑️ Supprimer un article
export const removeFromCart = async (email, item_id) => {
  return await api.delete("/cart/remove/", { data: { email, item_id } });
};

export const createPayPalOrder = async (email, amount, currency = "USD") => {
  try {
    const response = await api.post("/payments/create-order/", {
      email,
      amount,
      currency,
    });
    return response.data; // contient { order_id, approval_url }
  } catch (error) {
    console.error("Erreur création commande PayPal :", error.response?.data || error);
    throw error;
  }
};

// 🔹 Capturer un paiement PayPal après validation
export const capturePayPalOrder = async (order_id) => {
  try {
    const response = await api.post("/payments/capture-order/", { order_id });
    return response.data; // contient le message et les infos du paiement
  } catch (error) {
    console.error("Erreur capture paiement PayPal :", error.response?.data || error);
    throw error;
  }
};