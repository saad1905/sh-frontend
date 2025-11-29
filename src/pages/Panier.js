import React, { useEffect, useState } from "react";
import { fetchCart, removeFromCart, createPayPalOrder, capturePayPalOrder } from "../api/APIServices";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Trash2 } from "lucide-react";
import { PuffLoader } from "react-spinners";


function Panier() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 🔹 Récupérer l'utilisateur connecté
  const getUserData = () => {
    const cookie = document.cookie.split("; ").find((r) => r.startsWith("userData="));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : null;
  };

  // 🔹 Charger le panier
  const loadCart = async () => {
    const userData = getUserData();
    if (!userData || !userData.email) {
      setMessage("⚠️ Vous devez être connecté pour voir votre panier.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetchCart(userData.email);
      setCart(res.data[0] || null);
    } catch (error) {
      setMessage("❌ Erreur lors du chargement du panier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // 🔄 Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const newIndexes = { ...prev };
        cart?.items?.forEach((cartItem) => {
          const total = cartItem.item?.images?.length || 0;
          if (total > 1) {
            newIndexes[cartItem.id] = (prev[cartItem.id] + 1 || 1) % total;
          }
        });
        return newIndexes;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [cart]);

  // 🔹 Navigation manuelle
  const handleNext = (id, total) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] + 1 || 1) % total,
    }));
  };

  const handlePrev = (id, total) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total,
    }));
  };

  // 🔹 Suppression
  const handleRemove = async (itemId) => {
    const userData = getUserData();
    if (!userData?.email) return;
    try {
      await removeFromCart(userData.email, itemId);
      alert("🗑️ Article supprimé du panier !");
      setTimeout(() => window.location.reload(), 300);
    } catch {
      alert("❌ Erreur lors de la suppression de l’article.");
    }
  };

  // 🔹 Paiement avec PayPal
  const handleCreateOrder = async () => {
    const userData = getUserData();
    const response = await createPayPalOrder(userData.email, cart.total_price, "USD");
    return response.order_id; // PayPal Buttons attend un orderId
  };

  const handleApprove = async (data) => {
    const res = await capturePayPalOrder(data.orderID);
    if (res.payment) {
      setPaymentSuccess(true);
      alert("✅ Paiement réussi !");
    } else {
      alert("⚠️ Erreur lors de la capture du paiement.");
    }
  };

  // 🔹 États visuels
  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <PuffLoader color="#0b2e14" size={80} />
        <p
          className="mt-3 fw-semibold"
          style={{ color: "#0b2e14", fontSize: "1.1rem" }}
        >
          Chargement des meubles...
        </p>
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center mt-5">
        <h3 style={{ color: "#0b2e14" }}>🛒 Votre panier est vide.</h3>
        <p className="text-muted">Ajoutez des meubles depuis la page d’achat.</p>
      </div>
    );

  return (
    <div className="container mt-5 mb-4">
      <div className="text-center mb-4 d-flex justify-content-center">
        <h2
          className="fw-bold"
          style={{
            color: "#0b2e14",
            letterSpacing: "2px",
            textTransform: "uppercase",
            position: "relative",
            display: "inline-block",
            paddingBottom: "10px",
            fontSize: "1.8rem",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          🛒 Mon Panier
          <span
            style={{
              content: '""',
              position: "absolute",
              left: "50%",
              bottom: "0",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              backgroundColor: "#145c2c",
              borderRadius: "2px",
            }}
          ></span>
        </h2>
      </div>

      <div
        className="shadow rounded p-3 p-md-4"
        style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #e8e8e8",
        }}
      >
        {cart.items.map((cartItem) => {
          const images = cartItem.item?.images || [];
          const currentIndex = currentIndexes[cartItem.id] || 0;
          const currentImage =
            images.length > 0 ? images[currentIndex]?.image : null;

          return (
            <div
              key={cartItem.id}
              className="d-flex flex-wrap align-items-center justify-content-between border rounded py-3 px-3 mb-3"
              style={{
                backgroundColor: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                gap: "15px",
                rowGap: "20px",
              }}
            >
              {/* 🖼️ Image */}
              <div
                style={{
                  width: "120px",
                  height: "90px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "10px",
                  border: "2px solid #0b2e14",
                  flexShrink: 0,
                  margin: "auto",
                }}
              >
                {images.length > 0 ? (
                  <>
                    <img
                      src={currentImage}
                      alt={cartItem.item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "0.6s ease-in-out",
                      }}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrev(cartItem.id, images.length)}
                          style={arrowStyle("left")}
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => handleNext(cartItem.id, images.length)}
                          style={arrowStyle("right")}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#555",
                    }}
                  >
                    Pas d’image
                  </div>
                )}
              </div>

              {/* 🪑 Infos du meuble */}
              <div className="flex-grow-1 text-center text-md-start" style={{ minWidth: "150px" }}>
                <h6 className="fw-bold mb-1" style={{ color: "#0b2e14" }}>
                  {cartItem.item.title}
                </h6>
                <p className="text-muted mb-1">{cartItem.item.city}</p>
                <p className="mb-0 fw-semibold" style={{ color: "#145c2c" }}>
                  {cartItem.item.price} DH × {cartItem.quantity}
                </p>
              </div>

              {/* 🗑️ Supprimer */}
              <div className="text-center">
                <button
                  className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-1 mx-auto"
                  onClick={() => handleRemove(cartItem.item.id)}
                  style={{
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    minWidth: "120px",
                  }}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}

        {/* 💰 Total + Paiement */}
        <div className="text-center mt-4">
          <h5 className="fw-bold">
            Total :{" "}
            <span style={{ color: "#145c2c", fontWeight: "700" }}>
              {cart.total_price} DH
            </span> 
          </h5>

          {/* 🪙 PayPal Button */}
          <div className="mt-3 d-flex justify-content-center">
            <PayPalScriptProvider
              options={{
                "client-id": "ATol-P7H3Er4lG8CxaZDhKlL55rEA8t_l4Lpt4nYaMSiInxjavSQG4hyAST3YI4p89e4Vj2DTUaEg2sZ", // 🔑 à remplacer
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{ layout: "horizontal", color: "gold" }}
                createOrder={handleCreateOrder}
                onApprove={(data) => handleApprove(data)}
              />
            </PayPalScriptProvider>
          </div>

          {paymentSuccess && (
            <div className="alert alert-success mt-3" role="alert">
              ✅ Paiement effectué avec succès !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 🎯 Style commun pour les flèches
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "8px",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "25px",
  height: "25px",
  cursor: "pointer",
  fontSize: "18px",
  lineHeight: "0",
});

export default Panier;
