import React, { useState } from "react";
import api from "../api/axiosConfig";

function RentItem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    contact_phone: "",
    images: [],
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Lire l'utilisateur depuis le cookie
      const cookie = document.cookie.split("; ").find((r) => r.startsWith("userData="));
      const userData = cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : null;

      if (!userData || !userData.email) {
        alert("⚠️ Vous devez être connecté pour vendre un meuble.");
        return;
      }

      const data = new FormData();

      // Ajouter les champs texte
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("city", formData.city);
      data.append("address", formData.address);
      data.append("contact_phone", formData.contact_phone);

      // ✅ Forcer le type côté front pour satisfaire le serializer
      data.append("item_type", "SELL");

      // Ajouter l’owner (email) pour le lier côté backend
      data.append("owner_email", userData.email);

      // Ajouter les images multiples
      (formData.images || []).forEach((file) => data.append("images", file));

      await api.post("/rent-items/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Meuble ajouté avec succès !");
      setFormData({
        title: "",
        description: "",
        price: "",
        city: "",
        address: "",
        contact_phone: "",
        images: [],
      });
      setPreviews([]);
    } catch (err) {
      console.error(err);
      // remonter les erreurs du serializer si présentes
      const msg =
        err?.response?.data
          ? `❌ ${JSON.stringify(err.response.data)}`
          : "❌ Erreur lors de l’ajout du meuble.";
      setError(msg);
    }
  };

  return (
    <div className="container mt-5" style={{ color: "#0b2e14" }}>
      {/* Titre */}
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
          Louer un meuble
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

      {message && <div className="alert alert-success text-center fw-semibold">{message}</div>}
      {error && <div className="alert alert-danger text-center fw-semibold">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded"
        style={{ backgroundColor: "#f4f4f4", border: "1px solid #e8e8e8" }}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Titre du meuble</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ borderColor: "#0b2e14" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Prix (DH)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              style={{ borderColor: "#0b2e14" }}
            />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              style={{ borderColor: "#0b2e14" }}
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
              style={{ borderColor: "#0b2e14" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Adresse</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              style={{ borderColor: "#0b2e14" }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Téléphone</label>
            <input
              type="text"
              name="contact_phone"
              className="form-control"
              value={formData.contact_phone}
              onChange={handleChange}
              style={{ borderColor: "#0b2e14" }}
            />
          </div>

          {/* Images multiples */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Images du meuble (plusieurs possibles)</label>
            <input
              type="file"
              name="images"
              className="form-control"
              multiple
              onChange={handleImages}
              accept="image/*"
              style={{ borderColor: "#0b2e14" }}
            />
            {previews.length > 0 && (
              <div className="mt-3 d-flex flex-wrap justify-content-center gap-3" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Image ${i + 1}`}
                    style={{
                      width: "120px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "2px solid #0b2e14",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100 mt-3 fw-semibold"
          style={{ backgroundColor: "#0b2e14", borderColor: "#0b2e14", color: "#f4f4f4" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#145c2c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0b2e14")}
        >
          Publier mon meuble
        </button>
      </form>
    </div>
  );
}

export default RentItem;
