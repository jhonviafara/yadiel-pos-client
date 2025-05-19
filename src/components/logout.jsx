// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Ícono de logout

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
         className="fixed top-4 left-4 flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-200 z-50"    >
      <FiLogOut size={20} />
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
