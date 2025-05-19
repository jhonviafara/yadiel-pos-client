// src/components/LandingRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      navigate("/inventario"); // o la ruta principal si está logueado
    } else {
      navigate("/login"); // o la ruta que uses para iniciar sesión
    }
  }, []);

  return null; // no renderiza nada, solo redirige
};

export default LandingRedirect;
