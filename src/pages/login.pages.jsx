import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo_pdv.png";
import StyledButton from "../components/StyledButton";
import StyledInput from "../components/StyledInput";

function Login() {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [comercioId, setComercioId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Para el registro
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  setTimeout;
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!nombre || !password) {
      setError(" debe completar todos los campos ");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, password }),
      });
      const data = await response.json();

      if (response.status == 200) {
        //ahora con  respuesta del servidor  y si es estatos 200 destructuro de la respuesta el rol y el token
        const { token, rol,id,idcomercio} = data;
        console.log(data);
         //para poder trabajar con el rol de usuario
        if (token) {
          //guardo el token y el rol el el sessionStorage;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("rol", rol);
          sessionStorage.setItem("idUser", id);  
          sessionStorage.setItem("comercioId",idcomercio );
          console.log("Token guardado en sessionStorage:", sessionStorage.getItem("idUser"));
          
          alert("Usuario y token registrados con éxito");
        }

        return navigate("/home");
      } else {
        setError("Nombre o contraseña incorrectos");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error en el inicio de sesión", err);
      setError("Hubo un problema con el inicio de sesión");
      setTimeout(() => setError(""), 3000); // Borra el mensaje de error automáticamente
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, email, password, rol,comercioId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error en el registro");
        return;
      }

      const data = await response.json();
      setError("Usuario registrado con éxito");
    } catch (err) {
      console.error("Error en el registro", err);
      setError("Hubo un problema con el registro");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 flex justify-center items-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-gray-600 shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6">
      <img src={Logo} alt="logo" className="w-60 h-50 mx-auto   " />
     
    
         {isRegistering ? (
          <form className="max-w-md" onSubmit={handleRegister}>
            <StyledInput
              placeholder={"Ingrese su usuario"}
              textColor={"text-gray"}
              value={nombre}
              type="text"
              onChange={(e) => setNombre(e.target.value)}
            />
            <StyledInput
              placeholder={"Ingrese su correo electrónico"}
              type="email"
              textColor={"text-gray"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledInput
              placeholder={"Ingrese su rol"}
              type="number"
              textColor={"text-gray"}
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            />
            <StyledInput
              placeholder={"ingrese id del comercio"}
              type="number"
              textColor={"text-gray"}
              value={comercioId}  
              onChange={(e) => setComercioId(e.target.value)}
            />
            <StyledInput
              placeholder={"Ingrese su contraseña"}
              type="password"
              textColor={"text-gray"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledInput
              placeholder={"Confirme su contraseña"}
              type="password"
              textColor={"text-gray"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <StyledButton accept innerText={"Registrarse"} btnType={"submit"} />
          </form>
        ) : (
          <form className="max-w-md space--5" onSubmit={handleLogin}>
            <StyledInput
              placeholder={"Ingrese su usuario"}
              textColor={"text-gray"}
              value={nombre}
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              className="input input-bordered w-full bg-slate-800 text-white placeholder:text-slate-400"
            />
            <StyledInput
              placeholder={"Ingrese su  contraseña"}
              type="password"
              textColor={"text-gray"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-slate-800 text-white placeholder:text-slate-400"
            />

            {error && <p className="text-red-500">{error}</p>}
            <StyledButton accept innerText={"Ingresar"} btnType={"submit"} className="btn btn-success w-full text-white font-semibold shadow-lg hover:scale-105 transition-transform"/>
          </form>
        )
}
          <button
          className="text-white mt-4 underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Ya tienes cuenta? Inicia sesión"
            : "No tienes cuenta? Regístrate"}
        </button> 
      </div>
    </div>
  );
}

export default Login;
