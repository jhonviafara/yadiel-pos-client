import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StyledInput from "../components/StyledInput";
import { getHistorialVentas } from "../services/historial-ventas.service";

function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const[ paginaActual , setPaginaActual] = useState(1);
  const ventasPorPagina = 10;
  const [ filtroMetodopago ,  setfiltroMetodopago ] = useState("Todas");

  const ventasFiltradas = ventas.filter((venta)=>{
    if(filtroMetodopago === "Todas")return true;
    
    return venta.metodo_pago?.toLocaleLowerCase().includes(filtroMetodopago.toLocaleLowerCase()); ;
   }
  );
  
  const indiceUltimaVenta = paginaActual * ventasPorPagina;
  const indicePrimeraVenta = indiceUltimaVenta - ventasPorPagina;
  const ventasActuales = ventasFiltradas.slice(indicePrimeraVenta, indiceUltimaVenta);
  const totalPaginas = Math.ceil(ventas.length / ventasPorPagina); 

  async function obtenerVentas() {
    const res = await getHistorialVentas();  
    setVentas(res); 

       
  } 
  useEffect(() => {
    obtenerVentas();
  }, []);




  return (
    <>
      <Navbar />

     {/* 
           <div className="bg-gradient-to-br from-gray-600 via-slate-700 to-gray-600 min-h-screen flex flex-col items-center">
        { Filtros }
       { <div className="filtros-container gap-9 mb-3 flex w-25">
         { <StyledInput
            textColor={"text-black"}
            type={"text"}
            placeholder={"Filtrar por cliente"}
          /> }
          <StyledInput
            textColor={"text-black"}
            type={"text"}
            placeholder={"Filtrar por producto"}
          />
          <StyledInput
            textColor={"text-black"}
            type={"text"}
            placeholder={"Filtrar por fecha"}
          />
        </div>} 
       

         filtro por metodo de pago funcional */}
        <div role="tablist" className="tabs tabs-boxed bg-gray-700 text-black mb-2">
          {["Todas","Transferencia","Efectivo", "Tarjeta"].map((tipo)=>(
            <button key={tipo}
            role="tab"
            className={`tab ${filtroMetodopago === tipo ? "tab-active": ""}`}//boton seleccionado
            onClick={()=> setfiltroMetodopago(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="flex-grow justify-center w-full mb-6 mt-4 overflow-x-auto">
          <table className="table text-black w-full ">
            <thead className="text-gray-700 bg-gray-300">
              <tr className="[&>th]:py-2 [&>th]:px-3"> 
                <th>ID</th>
                <th>Vendedor</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Método de Pago</th>
              </tr>
            </thead>
            <tbody className="text-black bg-blue-500 ">
              {ventasActuales.map((venta, index) => (
                <tr key={index}>
                  <td className="bg-gray-400 font-medium">{venta.id}</td>
                  <td className="whitespace-nowrap">{venta.cliente}</td>
                  <td className="min-w-[150px]">{venta.productos}</td>
                  <td className="whitespace-nowrap font-medium">
                    {venta.total_venta.toLocaleString('es-AR',{
                            style: 'currency',
                            currency: 'ARS',
                      }
                      )}
                  </td>
                  <td className="whitespace-nowrap">{venta.fecha}</td>
                  <td className="whitespace-nowrap">{venta.hora}</td>
                  <td className="min-w-[180px]">{venta.metodo_pago?.includes('+') 
                      ? venta.metodo_pago.split('+').map((metodo, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                            {metodo.trim()}
                            
                        </div>                          
                          ))
                      : venta.metodo_pago?.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 gap-2">
  <button
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
    disabled={paginaActual === 1}
  >
    Anterior
  </button>

  {[...Array(totalPaginas)].map((_, index) => (
    <button
      key={index}
      className={`px-3 py-1 rounded ${paginaActual === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
      onClick={() => setPaginaActual(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
    disabled={paginaActual === totalPaginas}
  >
    Siguiente
  </button>
</div>

        </div>
     {/*  </div> */}
    </>
  );
}

export default HistorialVentas;