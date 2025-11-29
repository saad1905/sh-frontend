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
  <div className="container-fluid d-flex align-items-center justify-content-between">

    {/* LOGO */}
    <Link to="/" className="navbar-brand d-flex align-items-center text-white fw-bold m-0">
      <img
        src={logo}
        alt="Logo"
        style={{ height: "55px", marginRight: "10px", borderRadius: "5px" }}
      />
      <span className="d-none d-md-inline" style={{ letterSpacing: "1px" }}>
        STUDENT<span style={{ color: "#d4d4d4" }}>HOME</span>
      </span>
    </Link>

    {/* 🔥 Partie droite commune (LOGIN/REGISTER ou PROFIL/PANIER) */}
    <div className="d-flex align-items-center gap-3">

      {/* SI NON CONNECTÉ */}
      {!user && (
        <div className="d-flex align-items-center">
          <Link
            to="/register"
            className="btn btn-sm me-2"
            style={{
              border: "1px solid #f4f4f4",
              color: "#f4f4f4",
              fontWeight: "500",
              padding: "5px 10px",
            }}
          >
            Register
          </Link>

          <Link
            to="/login"
            className="btn btn-sm"
            style={{
              border: "1px solid #d4d4d4",
              color: "#d4d4d4",
              fontWeight: "500",
              padding: "5px 10px",
            }}
          >
            Login
          </Link>
        </div>
      )}

      {/* SI CONNECTÉ */}
      {user && (
        <div className="d-flex align-items-center gap-3 position-relative">

          {/* 🛒 PANIER */}
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
            >
              <ShoppingCart size={25} />
            </button>

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
                }}
              >
                {cartCount}
              </span>
            )}
          </div>

          {/* 👤 PROFIL */}
          <div className="d-flex align-items-center">
            <img
              src={user.profile_picture}
              alt="Profil"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff",
                cursor: "pointer",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>

          {/* MENU DROPDOWN */}
          {menuOpen && (
            <div
              className="position-absolute shadow rounded"
              style={{
                top: "55px",
                right: "0",
                backgroundColor: "#f8f9fa",
                minWidth: "180px",
                zIndex: 2000,
              }}
            >
              <button
                className="dropdown-item"
                onClick={goToProfile}
                style={{ fontWeight: "500", padding: "10px" }}
              >
                👤 Mon profil
              </button>

              <hr className="m-0" />

              <button
                className="dropdown-item"
                onClick={handleLogout}
                style={{ color: "red", fontWeight: "500", padding: "10px" }}
              >
                🚪 Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</nav>

  );
}

export default Navbar;
