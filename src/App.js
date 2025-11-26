import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import RentPage from "./pages/RentPage";
import SellItem from "./pages/Vendre";
import Acheter from "./pages/Acheter";
import Panier from "./pages/Panier";
import MeubleDetails from "./pages/MeubleDetails";
import RentItem from "./pages/Louer";
import MeubleDetailsRent from "./pages/MeubleDetailsRent";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Navbar />
      <div
        style={{
          paddingTop: isMobile ? "110px" : "80px",
          paddingBottom: isMobile ? "80px" : "80px",
          transition: "padding-top 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/louer" element={<RentPage />} />
          <Route path="/vendre" element={<SellItem />} />
          <Route path="/acheter" element={<Acheter />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/meuble/:id" element={<MeubleDetails />} />
          <Route path="/meuble-rent/:id" element={<MeubleDetailsRent />} />
          <Route path="/ajouter-location" element={<RentItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
