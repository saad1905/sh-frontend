import axios from "axios";

const api = axios.create({
  baseURL: "https://sh-backend-3.onrender.com/api",
  // baseURL: "http://127.0.0.1:8000/api",

  withCredentials: true,
  // ⛔️ ne mets pas Content-Type ici !
  headers: { Accept: "application/json" },
});

// ✅ Récupérer CSRF token
export const initCsrf = async () => {
  await api.get("/csrf/");
};

export default api;
