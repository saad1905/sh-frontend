import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { UserContext } from "../context/UserContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleNavigate = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff", // 🔹 fond blanc pur
        color: "#0b2e14",
        padding: "0 20px",
      }}
    >
      {/* 🔹 Logo */}
      <img
        src={logo}
        alt="StudentHome"
        style={{
          height: "90px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      />

      {/* 🔹 Titre principal */}
      <h1
        style={{
          fontWeight: "700",
          fontSize: "2rem",
          color: "#0b2e14",
          marginBottom: "15px",
          letterSpacing: "1px",
        }}
      >
        Bienvenue sur <span style={{ color: "#145c2c" }}>StudentHome</span>
      </h1>

      {/* 🔹 Description */}
      <p
        style={{
          maxWidth: "700px",
          lineHeight: "1.7",
          fontSize: "1.05rem",
          marginBottom: "40px",
        }}
      >
        <strong>StudentHome</strong> est une plateforme conçue pour les étudiants
        afin de faciliter leur installation et leur vie quotidienne 🏡.  
        <br />
        Ici, vous pouvez :
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            marginTop: "15px",
            lineHeight: "1.8",
          }}
        >
          <li>🪑 <strong>Acheter</strong> un meuble d’occasion à petit prix</li>
          <li>🏡 <strong>Louer</strong> un meuble pour une période définie</li>
          <li>🔄 <strong>Mettre en location</strong> votre propre mobilier</li>
          <li>📦 <strong>Vendre</strong> vos anciens meubles aux autres étudiants</li>
        </ul>
        Le tout dans un cadre sûr, pratique et solidaire 💚.
      </p>

      {/* 🔹 Boutons d'action */}
      <div className="d-flex flex-column flex-md-row justify-content-center gap-3 flex-wrap">
        <button
          onClick={() => handleNavigate("/acheter")}
          className="btn"
          style={{
            backgroundColor: "#145c2c",
            color: "#fff",
            border: "none",
            padding: "12px 30px",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0b2e14")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#145c2c")}
        >
          🛒 Acheter un meuble
        </button>

        <button
          onClick={() => handleNavigate("/louer")}
          className="btn"
          style={{
            backgroundColor: "#fff",
            color: "#145c2c",
            border: "2px solid #145c2c",
            padding: "12px 30px",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#145c2c";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#145c2c";
          }}
        >
          🏡 Louer un meuble
        </button>

        <button
          onClick={() => handleNavigate("/ajouter-location")}
          className="btn"
          style={{
            backgroundColor: "#fff",
            color: "#0b2e14",
            border: "2px solid #0b2e14",
            padding: "12px 30px",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0b2e14";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#0b2e14";
          }}
        >
          🔄 Mettre un meuble en location
        </button>

        <button
          onClick={() => handleNavigate("/vendre")}
          className="btn"
          style={{
            backgroundColor: "#fff",
            color: "#0b2e14",
            border: "2px solid #0b2e14",
            padding: "12px 30px",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0b2e14";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#0b2e14";
          }}
        >
          📦 Vendre un meuble
        </button>
      </div>
    </div>
  );
}

export default Home;
