import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { ShoppingCart } from "lucide-react";
import api from "../api/axiosConfig";
import logo from "../assets/logo.jpeg";
import { CartContext } from "../context/CartContext"; // 🟢


function Navbar() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  // 🧠 Fonction pour charger le nombre d’articles
  const fetchCartCount = async (email) => {
    try {
      const res = await api.get(`/cart/?email=${email}`);
      if (res.data && res.data.length > 0) {
        const cart = res.data[0];
        const total = cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("❌ Erreur récupération du panier :", err);
      setCartCount(0);
    }
  };

  // 🔁 Charger à chaque fois que l’utilisateur est connecté
  useEffect(() => {
    if (user && user.email) {
      console.log("📦 Chargement du panier pour :", user.email);
      fetchCartCount(user.email);
    }
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
    setMenuOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const goToCart = () => {
    navigate("/panier");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm px-3 py-2"
      style={{
        backgroundColor: "#0b2e14",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid">
        {/* 🔹 Barre principale */}
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Logo */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center text-white fw-bold m-0"
          >
            <img
              src={logo}
              alt="Logo StudentHome"
              style={{
                height: "45px",
                marginRight: "10px",
                borderRadius: "5px",
              }}
            />
            <span className="d-none d-md-inline" style={{ letterSpacing: "1px" }}>
              STUDENT<span style={{ color: "#d4d4d4" }}>HOME</span>
            </span>
          </Link>

          {/* Si connecté */}
          {user && (
            <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>
              {/* 🛒 Icône panier + badge */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={goToCart}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    position: "relative",
                  }}
                  title="Voir le panier"
                >
                  <ShoppingCart size={25} />
                </button>

                {/* Badge rouge */}
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      background: "red",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      lineHeight: "1",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              {/* 👤 Profil */}
              <div className="d-flex align-items-center">
                <img
                  src={
                    user.profile_picture ||
                    "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                  }
                  alt="Profil"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fff",
                    cursor: "pointer",
                  }}
                />
                <span
                  className="text-white fw-semibold ms-2 d-none d-md-inline"
                  style={{ cursor: "pointer" }}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.first_name} {user.last_name}
                </span>
              </div>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  className="position-absolute shadow rounded"
                  style={{
                    top: "55px",
                    right: "0",
                    backgroundColor: "#f8f9fa",
                    minWidth: "180px",
                    zIndex: 2000,
                    animation: "fadeIn 0.2s ease-in-out",
                  }}
                >
                  <button
                    className="dropdown-item text-start w-100"
                    style={{
                      background: "none",
                      border: "none",
                      padding: "10px 15px",
                      color: "#0b2e14",
                      fontWeight: "500",
                    }}
                    onClick={goToProfile}
                  >
                    👤 Mon profil
                  </button>
                  <hr className="m-0" />
                  <button
                    className="dropdown-item text-start w-100"
                    style={{
                      background: "none",
                      border: "none",
                      padding: "10px 15px",
                      color: "#b30000",
                      fontWeight: "500",
                    }}
                    onClick={handleLogout}
                  >
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Si pas connecté */}
        {!user && (
          <div className="d-flex align-items-center ms-auto">
            <Link
              to="/register"
              className="btn me-2"
              style={{
                border: "1px solid #f4f4f4",
                color: "#f4f4f4",
                fontWeight: "500",
              }}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{
                border: "1px solid #d4d4d4",
                color: "#d4d4d4",
                fontWeight: "500",
              }}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
