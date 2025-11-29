import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../api/APIServices";
import { PuffLoader } from "react-spinners";


function Acheter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndexes, setCurrentIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/sell-items/");
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Erreur lors du chargement des meubles.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // 🔄 Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const newIndexes = { ...prev };
        items.forEach((item) => {
          const total = item.images?.length || 0;
          if (total > 1) {
            newIndexes[item.id] = (prev[item.id] + 1 || 1) % total;
          }
        });
        return newIndexes;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [items]);

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


  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  return (
    <div
      className="container mt-5 mb-5"
      style={{
        color: "#0b2e14",
      }}
    >
      {/* 🏷️ Titre stylé */}
      <div className="text-center mb-5 d-flex justify-content-center">
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
          Meubles à vendre
          <span
            style={{
              content: '""',
              position: "absolute",
              left: "50%",
              bottom: "0",
              transform: "translateX(-50%)",
              width: "90px",
              height: "3px",
              backgroundColor: "#145c2c",
              borderRadius: "2px",
            }}
          ></span>
        </h2>
      </div>

      {/* 🪑 Conteneur principal */}
      <div
        className="shadow p-4 rounded"
        style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #e8e8e8",
        }}
      >
        {items.length === 0 ? (
          <p className="text-center text-muted">
            Aucun meuble disponible pour le moment.
          </p>
        ) : (
          <div className="row">
            {items.map((item) => {
              const images = item.images || [];
              const currentIndex = currentIndexes[item.id] || 0;
              const currentImage =
                images.length > 0 ? images[currentIndex]?.image : null;

              return (
                <div className="col-md-4 mb-4" key={item.id}>
                  <div
  className="card h-100 border-0 shadow-sm"
  style={{
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  onClick={() => navigate(`/meuble/${item.id}`)}  // ✅ redirection vers la page du meuble
>
                    {/* 🖼️ Image */}
                    {images.length > 0 ? (
                      <div
                        style={{
                          position: "relative",
                          height: "230px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={currentImage}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "230px",
                            objectFit: "cover",
                            transition: "0.6s ease-in-out",
                          }}
                        />

                        {/* Flèches */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                handlePrev(item.id, images.length)
                              }
                              style={arrowStyle("left")}
                            >
                              ‹
                            </button>
                            <button
                              onClick={() =>
                                handleNext(item.id, images.length)
                              }
                              style={arrowStyle("right")}
                            >
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
                              color: "white",
                              fontSize: "13px",
                              padding: "3px 8px",
                              borderRadius: "8px",
                            }}
                          >
                            {currentIndex + 1}/{images.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          height: "230px",
                          backgroundColor: "#e9ecef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6c757d",
                          fontWeight: "500",
                        }}
                      >
                        Pas d’image
                      </div>
                    )}

                    {/* 🪑 Infos du meuble */}
                    <div
                      className="card-body d-flex flex-column"
                      style={{
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <h5
                        className="card-title fw-bold"
                        style={{ color: "#0b2e14" }}
                      >
                        {item.title}
                      </h5>
                      <p
                        className="card-text mb-2"
                        style={{ color: "#555", minHeight: "60px" }}
                      >
                        {item.description
                          ? item.description.slice(0, 100) +
                            (item.description.length > 100 ? "..." : "")
                          : "Aucune description"}
                      </p>

                      <p className="card-text mb-1 fw-semibold">
                        📍 {item.city || "Ville non spécifiée"}
                      </p>
                      <p className="card-text mb-3">
                        💰{" "}
                        <span
                          className="fw-bold"
                          style={{ color: "#145c2c", fontSize: "1.1rem" }}
                        >
                          {item.price ? `${item.price} DH` : "Prix non défini"}
                        </span>
                      </p>

                      {/* ✅ Bouton Acheter */}
                      <button
                        className="btn mt-auto fw-semibold d-flex align-items-center justify-content-center gap-2"
                        style={{
                          backgroundColor: "#0b2e14",
                          color: "#fff",
                          borderRadius: "6px",
                          transition: "0.3s",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#145c2c")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#0b2e14")
                        }
                        onClick={async () => {
                          try {
                            const cookie = document.cookie
                              .split("; ")
                              .find((r) => r.startsWith("userData="));
                            const userData = cookie
                              ? JSON.parse(
                                  decodeURIComponent(cookie.split("=")[1])
                                )
                              : null;

                            if (!userData || !userData.email) {
                              alert(
                                "⚠️ Vous devez être connecté pour acheter un meuble."
                              );
                              return;
                            }

                            await addToCart(userData.email, item.id);
                            alert(
                              `✅ "${item.title}" a été ajouté à votre panier !`
                            );

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎯 Style commun des flèches
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

export default Acheter;
