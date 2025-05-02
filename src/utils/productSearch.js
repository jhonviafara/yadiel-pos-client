// Utilitario para búsqueda de productos
const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  export const createProductSearcher = () => {
    let cacheBusqueda = {};
    let busquedaActual = '';
  
    const buscarProductos = async (nombre, setProductosSugeridos) => {
      if (!nombre || nombre.length < 2) {
        setProductosSugeridos([]);
        return;
      }
  
      // Verificar caché
      if (cacheBusqueda[nombre]) {
        setProductosSugeridos(cacheBusqueda[nombre]);
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3001/productos`);
        const data = await response.json();
        
        // Filtrar productos que empiecen con el texto
        const productosFiltrados = data.filter(producto => 
          producto.nombre.toLowerCase().startsWith(nombre.toLowerCase())
        );
  
        // Actualizar caché
        cacheBusqueda[nombre] = productosFiltrados;
        
        // Solo actualizar si es la búsqueda actual
        if (nombre === busquedaActual) {
          setProductosSugeridos(productosFiltrados);
        }
      } catch (error) {
        console.error('Error al buscar productos:', error);
        if (nombre === busquedaActual) {
          setProductosSugeridos([]);
        }
      }
    };
  
    const obtenerProductos = debounce((nombre, setProductosSugeridos) => {
      busquedaActual = nombre;
      buscarProductos(nombre, setProductosSugeridos);
    }, 300);
  
    const clearCache = () => {
      cacheBusqueda = {};
    };
  
    return {
      obtenerProductos,
      clearCache,
      getCurrentSearch: () => busquedaActual
    };
  };