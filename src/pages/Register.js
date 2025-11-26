import React, { useState } from "react";
import api from "../api/axiosConfig";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    city: "",
    phone: "",
    email: "",
    password: "",
    profile_picture: null,
    student_document: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, student_document: file });

    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setDocPreview({ type: "image", url: URL.createObjectURL(file) });
      } else if (fileType === "application/pdf") {
        setDocPreview({ type: "pdf", url: URL.createObjectURL(file) });
      } else {
        setDocPreview(null);
      }
    } else {
      setDocPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formToSend = new FormData();
    for (let key in formData) {
      formToSend.append(key, formData[key]);
    }

    try {
      const res = await api.post("/users/register/", formToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`✅ ${res.data.message}`);
      setFormData({
        first_name: "",
        last_name: "",
        city: "",
        phone: "",
        email: "",
        password: "",
        profile_picture: null,
        student_document: null,
      });
      setPreview(null);
      setDocPreview(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError("❌ " + JSON.stringify(err.response.data));
      } else {
        setError("❌ Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        color: "#0b2e14",
      }}
    >
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
            Créer un compte
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

      <form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded"
        style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #e8e8e8",
        }}
      >
        <div className="row">
          {/* --- Informations de base --- */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Prénom</label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Nom</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              required
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Ville</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Téléphone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Adresse email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                borderColor: "#0b2e14",
              }}
            />
          </div>

          {/* --- Photo de profil --- */}
          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold">Photo de profil</label>
            <input
              type="file"
              name="profile_picture"
              className="form-control"
              onChange={handleFileChange}
              accept="image/*"
              style={{
                borderColor: "#0b2e14",
              }}
            />
            {preview && (
              <div className="mt-3 text-center">
                <img
                  src={preview}
                  alt="Aperçu profil"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #0b2e14",
                  }}
                />
              </div>
            )}
          </div>

          {/* --- Attestation ou carte étudiante --- */}
          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold">
              Attestation de scolarité ou carte étudiante
            </label>
            <input
              type="file"
              name="student_document"
              className="form-control"
              onChange={handleDocumentChange}
              accept=".pdf,image/*"
              style={{
                borderColor: "#0b2e14",
              }}
            />
            <small className="text-muted">
              Formats acceptés : PDF ou image (JPEG, PNG…)
            </small>

            {docPreview && (
              <div className="mt-3 text-center">
                {docPreview.type === "image" ? (
                  <img
                    src={docPreview.url}
                    alt="Aperçu du document"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "contain",
                      border: "2px solid #145c2c",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <iframe
                    src={docPreview.url}
                    title="Aperçu du PDF"
                    width="100%"
                    height="300px"
                    style={{
                      border: "2px solid #145c2c",
                      borderRadius: "6px",
                    }}
                  ></iframe>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100 mt-3 fw-semibold"
          style={{
            backgroundColor: "#0b2e14",
            borderColor: "#0b2e14",
            color: "#f4f4f4",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#145c2c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0b2e14")}
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;
