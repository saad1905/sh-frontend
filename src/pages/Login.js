import React, { useState, useContext, useEffect } from "react";
import api, { initCsrf } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Initialisation du CSRF
  useEffect(() => {
    initCsrf()
      .then(() => console.log("✅ CSRF initialisé"))
      .catch(() => console.warn("⚠️ Erreur lors de l'initialisation CSRF"));
  }, []);

  // 🧩 Gestion des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔐 Connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/users/login/", formData, {
        withCredentials: true,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const userData = {
        email: res.data.email,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        profile_picture: res.data.profile_picture,
        student_document: res.data.student_document,
      };

      // ✅ Sauvegarde en cookie
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(userData)
      )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;

      // ✅ Mise à jour du contexte utilisateur
      loginUser(userData);

      setMessage("✅ Connexion réussie !");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error("Erreur login :", err);
      setError("❌ Email ou mot de passe incorrect.");
    }
  };

  return (
    <div
      className="container mt-5 mb-5"
      style={{
        color: "#0b2e14",
      }}
    >
      {/* 🔹 Titre stylisé */}
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
          Connexion
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

      {/* 🔹 Messages de succès / erreur */}
      {message && (
        <div className="alert alert-success text-center fw-semibold">
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center fw-semibold">
          {error}
        </div>
      )}

      {/* 🔹 Formulaire stylisé */}
      <form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded"
        style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #e8e8e8",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        {/* Champ Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Adresse email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="exemple@gmail.com"
            style={{ borderColor: "#0b2e14" }}
          />
        </div>

        {/* Champ mot de passe */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Mot de passe</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Votre mot de passe"
            style={{ borderColor: "#0b2e14" }}
          />
        </div>

        {/* Bouton Se connecter */}
        <button
          type="submit"
          className="btn w-100 mt-3 fw-semibold"
          style={{
            backgroundColor: "#0b2e14",
            borderColor: "#0b2e14",
            color: "#f4f4f4",
            borderRadius: "6px",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#145c2c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0b2e14")}
        >
          Se connecter
        </button>

        {/* Lien vers inscription */}
        <p className="text-center mt-3" style={{ color: "#145c2c" }}>
          Vous n’avez pas encore de compte ?{" "}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#0b2e14",
              fontWeight: "600",
            }}
            onClick={() => navigate("/register")}
          >
            Créer un compte
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
