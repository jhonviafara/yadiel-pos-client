import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home.pages";
import Login from "./pages/login.pages";
import IngresarVenta from "./pages/iniciar-ventas-pos";
import HistorialVentas from "./pages/historial-ventas";
import Inventario from "./pages/inventario-stock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/iniciar-ventas" element={<IngresarVenta />}/>
        <Route path="/historial-ventas" element={<HistorialVentas />} /> 
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
