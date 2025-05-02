import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Asegúrate de importar useHistory
import LogoImage from "./LogoImage";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navegate = useNavigate(); // Inicializamos useHistory

  const handleLogout = () => {
    //eliminar le token de sessionstorage
    sessionStorage.removeItem("token");
    return navegate("/"); // Redirige al usuario a la página de inicio de sesión
  };
  const rolsave = sessionStorage.getItem("rol")



  return (
    <div className=" w-full  bg-green-600 p-4 border-white border border-gray-300 shadow-md rounded-md p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <LogoImage />
          <h1 className="text-white text-2xl font-bold ml-2">Villa Albino</h1>
        </div>

        {/* Menú principal para pantallas medianas y grandes */}
        <nav className=" max-w-7xl mx-auto hidden md:flex ml-4 max-w-7xl mx-auto px-4 flex justify-between items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/home" className="text-white">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/planilla-categorias" className="text-white">
                Categorias
              </Link>
            </li>
          
            <li>{ rolsave == "6323" ?(
              <Link id="cargar" to="/cargar-jugador" className="text-white">
                add jugadores
              </Link>):
              (
                null
              )
}
            </li>

            <li>
              <Link to="/fixture" className="text-white">
                Fixture
              </Link>
            </li>
            <li>
              <Link to="/planilla-jugadores" className="text-white">
                Jugadores
              </Link>
            </li>
            <li>
              <Link to="/planilla-entrenadores" className="text-white">
                Entrenadores
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón de menú para pantallas pequeñas */}
        <div className="md:hidden">
          <button onClick={() => setShowMenu(!showMenu)} className="text-white">
            {!showMenu ? "Menú" : "Cerrar"}
          </button>
        </div>

        {/* Menú desplegable para pantallas pequeñas */}
        <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
          <ul className="flex flex-col space-y-2">
            <li>
              <a href="#categorias" className="text-white">
                Categorias
              </a>
            </li>
            <li>
              <a href="#resultados" className="text-white">
                Resultados
              </a>
            </li>
            <li>
              <a href="#proximos-partidos" className="text-white">
                Próximos Partidos
              </a>
            </li>
            <li>
              <a href="#planilla-jugadores" className="text-white">
                Listado de Jugadores
              </a>
            </li>{" "}
            LINK
          </ul>
        </div>

        {/* Botón de Cerrar Sesión para pantallas medianas y grandes */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={handleLogout} // Agregamos la función aquí
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 
            hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 
            shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm 
            px-5 py-2.5 text-center me-2 mb-2"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
