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

// 🔹 Créer un paiement Stripe (PaymentIntent)
export const createStripePayment = async (email, amount) => {
  try {
    const response = await api.post("/payments/create-payment-stripe/", {
      email,
      amount,
    });
    return response.data; // { client_secret, payment_id, amount_mad, amount_usd }
  } catch (error) {
    console.error(
      "Erreur création paiement Stripe :",
      error.response?.data || error
    );
    throw error;
  }
};

// 🔹 Confirmer le paiement Stripe (après succès frontend)
export const confirmStripePayment = async (payment_intent_id) => {
  try {
    const response = await api.post("/payments/confirm-stripe-payment/", {
      payment_intent_id,
    });
    return response.data; // message + payment
  } catch (error) {
    console.error(
      "Erreur confirmation paiement Stripe :",
      error.response?.data || error
    );
    throw error;
  }
};