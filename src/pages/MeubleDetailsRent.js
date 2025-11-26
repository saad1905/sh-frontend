import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../api/APIServices";

function MeubleDetailsRent() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 Charger le meuble par ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/rent-items/${id}/`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [id]);

  // 🔁 Défilement automatique toutes les 2 secondes
  useEffect(() => {
    if (!item?.images || item.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % item.images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [item]);

  if (!item)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 fw-semibold">Chargement du meuble...</p>
      </div>
    );

  const images = item.images || [];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mt-5 mb-5">
      <div
        className="shadow p-4 rounded"
        style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #e8e8e8",
        }}
      >
        {/* 🔙 Bouton retour */}
        <button
          className="btn mb-3 fw-semibold"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#0b2e14",
            color: "#fff",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#145c2c")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0b2e14")}
        >
          ← Retour
        </button>

        <div className="row">
          {/* 🖼️ Section Images */}
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            {images.length > 0 ? (
              <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
                <img
                  src={images[currentIndex]?.image}
                  alt={item.title}
                  className="rounded"
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    border: "3px solid #0b2e14",
                    borderRadius: "10px",
                    transition: "0.6s ease-in-out",
                  }}
                />

                {/* Flèches navigation */}
                {images.length > 1 && (
                  <>
                    <button onClick={handlePrev} style={arrowStyle("left")}>
                      ‹
                    </button>
                    <button onClick={handleNext} style={arrowStyle("right")}>
                      ›
                    </button>
                  </>
                )}

                {/* Indicateur */}
                {images.length > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "12px",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                  >
                    {currentIndex + 1}/{images.length}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#e9ecef",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                Pas d’image
              </div>
            )}
          </div>

          {/* 🪑 Section Détails */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h2 className="fw-bold mb-3" style={{ color: "#0b2e14" }}>
              {item.title}
            </h2>

            <p className="mb-2 fw-semibold" style={{ color: "#145c2c" }}>
              📍 Ville : <span className="text-dark">{item.city || "Non spécifiée"}</span>
            </p>

            <p className="mb-2 fw-semibold" style={{ color: "#145c2c" }}>
              🏠 Adresse : <span className="text-dark">{item.address || "Non spécifiée"}</span>
            </p>

            <p className="mb-3 fw-semibold" style={{ color: "#145c2c" }}>
              📞 Contact : <span className="text-dark">{item.contact_phone || "Non spécifié"}</span>
            </p>

            <p className="mb-4" style={{ fontSize: "1.1rem" }}>
              {item.description || "Aucune description disponible."}
            </p>

            <h4 className="fw-bold mb-4" style={{ color: "#145c2c" }}>
              💰 {item.price} DH
            </h4>

            <button
              className="btn fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{
                backgroundColor: "#0b2e14",
                color: "#fff",
                borderRadius: "6px",
                width: "60%",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#145c2c")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0b2e14")}
              onClick={async () => {
                try {
                  const cookie = document.cookie
                    .split("; ")
                    .find((r) => r.startsWith("userData="));
                  const userData = cookie
                    ? JSON.parse(decodeURIComponent(cookie.split("=")[1]))
                    : null;

                  if (!userData || !userData.email) {
                    alert("⚠️ Vous devez être connecté pour acheter un meuble.");
                    return;
                  }

                  await addToCart(userData.email, item.id);
                  alert(`✅ "${item.title}" a été ajouté à votre panier !`);
                  navigate("/panier");
                  setTimeout(() => window.location.reload(), 200);
                } catch (err) {
                  console.error(err);
                  alert("❌ Erreur lors de l’ajout au panier.");
                }
              }}
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Style commun pour les flèches
const arrowStyle = (side) => ({
  position: "absolute",
  top: "50%",
  [side]: "10px",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "35px",
  height: "35px",
  cursor: "pointer",
  fontSize: "22px",
  lineHeight: "0",
});

export default MeubleDetailsRent;
