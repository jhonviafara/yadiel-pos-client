import { Link, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai"; // Home icon
import LogoutButton from "./logout";


const links = [
  { text: "Inventario", path: "/inventario" },
  { text: "Historial Ventas", path: "/historial-ventas" },
  { text: "Iniciar Ventas", path: "/iniciar-ventas" },
];

function Navbar() {
  const nombreUs = (localStorage.getItem("nombreUsuario") || "J")[0];
  const apellidoUs = (localStorage.getItem("apellidoUsuario") || "P")[0];
  const location = useLocation();

  return (
    <nav className="bg-gray-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
        
        {/* Ícono Home */}
        <Link to="/home" className="text-white hover:text-blue-400 text-2xl">
          <AiFillHome />
        </Link>
        
        {/* Links del centro */}
        <ul className="hidden md:flex gap-4">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-700 hover:text-white text-gray-300"
                }`}
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Usuario (iniciales + dropdown) */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar bg-blue-600 text-white hover:bg-blue-700"
          >
            {nombreUs}
            {apellidoUs}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-700 rounded-box w-52 text-white"
          >
            <li><a>Perfil</a></li>
            <li><a>Configuración</a></li>
            <li><a onClick={LogoutButton } >Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
