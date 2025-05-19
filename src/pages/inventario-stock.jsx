import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StyledInput from '../components/StyledInput';
import StyledButton from '../components/StyledButton';

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroStock, setFiltroStock] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [categorias, setCategorias] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina] = useState(10);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "General",
    codigo: ""
  });

  // Obtener productos al cargar
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const comercioId = sessionStorage.getItem("comercioId");
        const response = await fetch(`http://localhost:3001/productos?comercio_id=${comercioId}`);
        const data = await response.json();
        setProductos(data);
        
        // Extraer categorías únicas
        const cats = [...new Set(data.map(p => p.categoria))];
        setCategorias(cats);
      } catch (error) {
        console.error("Error obteniendo productos:", error);
      }
    };
    
    obtenerProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const cumpleStock = !filtroStock || producto.stock > 0;
    const cumpleCategoria = filtroCategoria === "Todas" || producto.categoria === filtroCategoria;
    return cumpleNombre && cumpleStock && cumpleCategoria;
  });

  // Paginación
  const indexUltimoProducto = paginaActual * productosPorPagina;
  const indexPrimerProducto = indexUltimoProducto - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexPrimerProducto, indexUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroStock(false);
    setFiltroCategoria("Todas");
    setPaginaActual(1);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "precio" || name === "stock" ? Number(value) : value
    });
  };

  // Editar producto
  const editarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      codigo: producto.codigo || ""
    });
    setMostrarModal(true);
  };

  // Guardar producto
  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      const url = productoSeleccionado 
        ? `http://localhost:3001/productos/${productoSeleccionado.id}`
        : "http://localhost:3001/productos";
      
      const method = productoSeleccionado ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          comercio_id: sessionStorage.getItem("comercioId")
        }),
      });

      if (!response.ok) throw new Error("Error al guardar el producto");

      // Actualizar lista
      const productoActualizado = await response.json();
      if (productoSeleccionado) {
        setProductos(productos.map(p => 
          p.id === productoSeleccionado.id ? productoActualizado : p
        ));
      } else {
        setProductos([...productos, productoActualizado]);
      }

      setMostrarModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      const response = await fetch(`http://localhost:3001/productos/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      setProductos(productos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />    
      <div className="bg-gradient-to-br from-gray-800 via-slate-900 to-gray-600 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Gestión de Inventario</h1>
          <StyledButton 
            innerText="+ Nuevo Producto" 
            className="bg-blue-600 hover:bg-blue-500"
            onClick={() => {
              setProductoSeleccionado(null);
              setFormData({
                nombre: "",
                descripcion: "",
                precio: 0,
                stock: 0,
                categoria: "General",
                codigo: ""
              });
              setMostrarModal(true);
            }}
          />
        </div>

        {/* Filtros */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StyledInput
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <select 
            className="bg-gray-600 text-white rounded p-2"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-white">
            <input 
              type="checkbox" 
              checked={filtroStock} 
              onChange={() => setFiltroStock(!filtroStock)} 
            />
            Solo con stock
          </label>
          <StyledButton 
            innerText="Limpiar Filtros" 
            className="bg-gray-500 hover:bg-gray-400"
            onClick={limpiarFiltros}
          />
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-right">Precio</th>
                <th className="p-3 text-right">Stock</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosPagina.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="p-3">{producto.codigo || "-"}</td>
                  <td className="p-3 font-medium">{producto.nombre}</td>
                  <td className="p-3">{producto.categoria}</td>
                  <td className="p-3 text-right">
                    {producto.precio.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      producto.stock > 10 ? 'bg-green-100 text-green-800' : 
                      producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {producto.stock} unidades
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => editarProducto(producto)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4 text-white">
          <span>
            Mostrando {indexPrimerProducto + 1}-{Math.min(indexUltimoProducto, productosFiltrados.length)} de {productosFiltrados.length} productos
          </span>
          <div className="flex gap-2">
            <button 
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={paginaActual === 1}
              onClick={() => cambiarPagina(paginaActual - 1)}
            >
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
              <button
                key={numero}
                className={`px-3 py-1 rounded ${paginaActual === numero ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-opacity-80`}
                onClick={() => cambiarPagina(numero)}
              >
                {numero}
              </button>
            ))}
            <button 
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={paginaActual === totalPaginas}
              onClick={() => cambiarPagina(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {productoSeleccionado ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={guardarProducto}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <StyledInput
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <StyledInput
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <StyledInput
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <StyledInput
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                      className="w-full p-2 border rounded"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      {categorias.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <StyledButton
                  type="button"
                  innerText="Cancelar"
                  className="bg-gray-500 hover:bg-gray-400"
                  onClick={() => setMostrarModal(false)}
                />
                <StyledButton
                  type="submit"
                  innerText="Guardar"
                  className="bg-blue-600 hover:bg-blue-500"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Inventario;