import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});

    if (cookies.userData) {
      try {
        const userData = JSON.parse(decodeURIComponent(cookies.userData));
        setUser(userData);
      } catch (error) {
        console.error("Erreur parsing cookie :", error);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div
      className="container mt-5 d-flex flex-column align-items-center"
      style={{ marginBottom: "80px" }}
    >
      {/* 🟢 Carte principale */}
      <div
        className="card shadow p-4 w-100"
        style={{ maxWidth: "600px", borderTop: "5px solid #145c2c" }}
      >
        {/* 🖼️ Photo de profil */}
        <div className="text-center mb-4">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="Profil"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #145c2c",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#ddd",
                display: "inline-block",
              }}
            ></div>
          )}
        </div>

        {/* 🧾 Informations utilisateur */}
        <h3
          className="text-center fw-bold mb-3"
          style={{ color: "#0b2e14", letterSpacing: "1px" }}
        >
          {user.first_name} {user.last_name}
        </h3>

        <ul className="list-group mb-3">
          <li className="list-group-item">
            <strong>📧 Email :</strong> {user.email}
          </li>
        </ul>

        {/* 🗂️ Document étudiant */}
        {user.student_document ? (
          <div className="text-center">
            <h5
              className="fw-semibold mb-3"
              style={{ color: "#0b2e14", letterSpacing: "0.5px" }}
            >
              Document étudiant
            </h5>

            {/* Vérifie le type de fichier */}
            {user.student_document.endsWith(".pdf") ? (
              <iframe
                src={user.student_document}
                title="Document étudiant"
                width="100%"
                height="350px"
                style={{
                  border: "2px solid #145c2c",
                  borderRadius: "6px",
                }}
              ></iframe>
            ) : (
              <img
                src={user.student_document}
                alt="Document étudiant"
                className="img-fluid rounded shadow-sm"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  border: "2px solid #145c2c",
                }}
              />
            )}

            <a
              href={user.student_document}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-3"
              style={{
                backgroundColor: "#145c2c",
                color: "#fff",
                fontWeight: "600",
                borderRadius: "5px",
              }}
            >
              Voir le document complet
            </a>
          </div>
        ) : (
          <div className="alert alert-warning text-center">
            Aucun document étudiant n’a été téléchargé.
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
