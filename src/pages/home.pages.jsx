import Header from "../components/Header"
import { Link } from "react-router-dom";
import {
  FaHistory,
  FaBoxes,
  FaPlusCircle,
  FaTools,
  FaCashRegister
} from "react-icons/fa";
import LogoutButton from "../components/logout";

function Home() {

  const buttons = [
    { to: "/iniciar-ventas", label: "Iniciar Ventas", icon: <FaCashRegister /> },
    { to: "/historial-ventas", label: "Historial Ventas", icon: <FaHistory /> },
    { to: "/inventario", label: "Inventario", icon: <FaBoxes /> },
    { to: "/añadir-productos", label: "Añadir Productos", icon: <FaPlusCircle /> },
/*     { to: "/productos-rotos", label: "Productos Rotos", icon: <FaTools /> },
 */    
  ];
  return (
   
  <>
  
    <div className="bg-gradient-to-br from-gray-800 via-slate-900 to-gray-600  w-full min-h-screen flex items-center justify-center">
    <LogoutButton />
     
     <div className="bg-white p-7 rounded-xl shadow-lg w-12/12 md:w-2/3 lg:w-1/2 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center text-gray-800">Panel Principal</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {buttons.map((btn, idx) => (
          <Link to={btn.to} key={idx}>
            <div className="flex items-center gap-3 bg-gray-600 hover:bg-gray-900 text-white p-4 rounded-lg shadow transition">
              <span className="text-xl">{btn.icon}</span>
              <span className="font-semibold">{btn.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
</>
);
}
export default Home;

