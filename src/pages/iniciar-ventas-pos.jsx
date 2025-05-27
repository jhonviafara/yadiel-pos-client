import { useState, useCallback, useEffect } from "react";
import { createProductSearcher } from "../utils/productSearch.js";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";
import BtnHome from "../components/btnHome.jsx";
import Navbar from "../components/Navbar.jsx";



function IngresarVenta() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoSugerido, setProductosSugeridos] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [ventaResumen, setVentaResumen] = useState(null);

  const [pagos, setPagos] = useState([
    { metodo: "Transferencia", monto: "" },
    { metodo: "Tarjeta", monto: "" },
    { metodo: "Efectivo", monto: "" },
  ]);

  const productSearcher = useCallback(createProductSearcher(), []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      productSearcher.clearCache();
    };
  }, [productSearcher]);

  // Manejador de cambio
  const handleProductoChange = (e) => {
    const value = e.target.value;
    setProductoSeleccionado({ nombre: value });
    productSearcher.obtenerProductos(value, setProductosSugeridos);
  };


  const seleccionarProducto = (producto) => {
    if (producto && producto.id && producto.nombre && producto.precio) {
      setProductoSeleccionado(producto);
      setProductosSugeridos([]);
    }
  };

  const agregarProducto = () => {
    // Validación mejorada del producto seleccionado
    if (!productoSeleccionado || !productoSeleccionado.id || !productoSeleccionado.nombre || !productoSeleccionado.precio) {
      alert("Debe seleccionar un producto válido");
      return;
    }
    
    if (cantidad <= 0) {
      alert("La cantidad debe ser mayor a cero");
      return;
    }

    // Añadir al carrito solo las propiedades necesarias
    setCarrito([
      ...carrito,
      { 
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre, 
        precio: productoSeleccionado.precio,
        cantidad: Number(cantidad) 
      },
    ]);
    
    // Limpiar los campos
    setProductoSeleccionado(null);
    setCantidad(0);
  };

  const eliminarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const montoPagado = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);
  const faltante = total - montoPagado;
  const cambio = montoPagado > total ? montoPagado - total : 0;

  const actualizarPago = (metodo, monto) => {
    setPagos(
      pagos.map((p) =>
        p.metodo === metodo ? { ...p, monto: Number(monto) || 0 } : p
      )
    );
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0 || total === 0) {
      alert("Faltan datos para confirmar la venta");
      return;
    }
    if (faltante > 0) {
      alert("El monto pagado no cubre el total de la compra.");
      return;
    }
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const usuario_id = sessionStorage.getItem("idUser");// Reemplazar con ID real del usuario
    const comercio_id =sessionStorage.getItem("comercioId") ;
    const venta = {
        usuario_id,
        comercio_id,
        productos: carrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),// Reemplazar con ID real del comercio
      pagos: pagos.filter((p) => p.monto > 0),
      total,
      cambio,
      fecha,
    };
   

    try {
      const response = await fetch("http://localhost:3001/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),
      });
      if (!response.ok) {
        throw new Error("Error al guardar la venta.");
      }  
      setVentaResumen(venta);
      setMostrarResumen(true);
      alert("Compra realizada con éxito");
   
      
      // Limpiar el carrito después de una venta exitosa
      setCarrito([]);
      setPagos(pagos.map(p => ({...p, monto: ""})));
      
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al registrar la venta.");
    }
  };

  const guardarVenta = () => {
    setProductoSeleccionado(null);
    setCantidad(0);
    setMostrarResumen(false);
    setVentaResumen(null);
    setCarrito([]);
    setPagos([
      { metodo: "Transferencia", monto: "" },
      { metodo: "Tarjeta", monto: "" },
      { metodo: "Efectivo", monto: "" },
    ]);
  };

  const imprimirFactura = () => {
    if (!ventaResumen) return;

    const { fecha, productos, pagos, total } = ventaResumen;
    const fechaFormateada = new Date(fecha).toLocaleString();

    const contenido = `
      <div class="header">
        <h1>Factura</h1>
      </div>
  
      <div class="info">
        <table>
          <tr><td><strong>Fecha:</strong></td><td>${fechaFormateada}</td></tr>
        </table>
      </div>
  
      <h2>Productos</h2>
      <table class="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${productos.map(p => `
            <tr>
              <td>${p.nombre}</td>
              <td>${p.cantidad}</td>
              <td>$${p.precio.toFixed(2)}</td>
              <td>$${(p.precio * p.cantidad).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
  
      <h2>Pagos</h2>
      <table class="tabla">
        <thead>
          <tr>
            <th>Método</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${pagos.filter(p => p.monto > 0).map(p => `
            <tr>
              <td>${p.metodo}</td>
              <td>$${p.monto.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
  
      <div class="total">
        <strong>Total a pagar: $${total.toFixed(2)}</strong>
      </div>
    `;

    const ventana = window.open('', '_blank', 'width=800,height=800');
    ventana.document.write(`
      <html>
        <head>
          <title>Factura</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              background-color: #f9f9f9;
              color: #333;
            }
            .header {
              background-color: #f1f1f1;
              padding: 10px;
              text-align: center;
              margin-bottom: 30px;
              border-radius: 8px;
            }
            h1 {
              margin: 0;
            }
            .info table {
              width: 100%;
              margin-bottom: 30px;
              font-size: 16px;
            }
            h2 {
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-top: 30px;
            }
            .tabla {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .tabla th, .tabla td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
            }
            .tabla th {
              background-color: #f2f2f2;
            }
            .total {
              font-size: 18px;
              text-align: right;
              margin-top: 20px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${contenido}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.print();
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-800 via-slate-900 to-gray-600 flex justify-center items-center px-4 min-h-screen">
        <div className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white rounded">
          <a href=""><BtnHome /></a><span> Home </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg w-full md:w-11/12 lg:w-4/5 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 flex flex-col gap-4 text-lg font-semibold text-black">
            <h1 className="text-3xl font-bold text-center text-gray-600">Registrar Venta</h1>
            <div>
              <h3 className="text-lg font-semibold text-black mb-1">Agregar Producto</h3>
              <div className="flex gap-3 flex-wrap">
                <StyledInput
                  name="producto"
                  placeholder ="Producto"
                  type="text"
                  value={productoSeleccionado?.nombre || ''}
                  onChange={handleProductoChange}
                  className="flex-1 "
                />
                {productoSugerido.length > 0 && (
                  <div className="bg-white shadow-lg rounded mt-1 max-h-60 overflow-y-auto w-full">
                    <ul>
                      {productoSugerido.map((producto) => (
                        <li
                          key={producto.id}
                          onClick={() => seleccionarProducto(producto)}
                          className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        >
                          {producto.nombre} - {producto.precio.toLocaleString('es-AR',{
                            style: 'currency',
                            currency: 'ARS',
                          })}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
               <div>
               <label htmlFor="cantidadProducto" >cantidad:</label>
                <StyledInput
                  name="cantidadProduct"
                  type="number"
                  placeholder="Cantidad"
                  value={cantidad}
                  min="0"
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                  className="w-24"
                />
               <StyledButton
                  innerText="Añadir al Carrito"
                  onClick={agregarProducto}
                  className="bg-green-700 mt-5 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-center flex items-center justify-center w-fit h-fit"
                />
                 </div>
             
              </div>
            </div>

            {carrito.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Carrito</h3>
                <ul className="bg-gray-100 rounded p-4 max-h-60 overflow-auto">
                  {carrito.map((item, index) => (
                    <li key={`${item.id}-${index}`} className="flex justify-between mb-3">
                      <div>
                        {item.nombre} - {item.cantidad} u. x ${item.precio.toFixed(2)} = ${(item.precio * item.cantidad).toFixed(2)}       
                      </div>
                      <button 
                        onClick={() => eliminarProducto(index)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                  <li className="font-bold border-t pt-2 mt-2">
                    Total: ${total.toFixed(2)}
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-gray-700">Pagos</h3>
              {pagos.map((pago, index) => (
                <div key={pago.metodo} className="flex gap-3 items-center">
                  <div className="w-24">{pago.metodo}:</div>
                  <StyledInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={pago.monto}
                    onChange={(e) => actualizarPago(pago.metodo, e.target.value)}
                    className="w-32"
                    placeholder="0.00"
                  />
                </div>
              ))}
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>Total a pagar:</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monto pagado:</span>
                  <span className="font-bold">${montoPagado.toFixed(2)}</span>
                </div>
                {faltante > 0 && (
                  <div className="text-red-600 flex justify-between">
                    <span>Faltante:</span>
                    <span>${faltante.toFixed(2)}</span>
                  </div>
                )}
                {cambio > 0 && (
                  <div className="text-green-600 flex justify-between">
                    <span>Cambio:</span>
                    <span>${cambio.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <StyledButton
                innerText="Confirmar Venta"
                onClick={confirmarVenta}
                disabled={faltante > 0 || carrito.length === 0}
                className={`w-full py-2 px-4 rounded-xl ${
                  faltante > 0 || carrito.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IngresarVenta;