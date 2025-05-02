import {useCallback, useState,useMemo}from "react";
const clientMock = ["raul","andres","julio","hernan"];
const productsMock =[
    {nombre:"arroz kilo",precio:1400},
    {nombre:"chupetin",precio:400},
    {nombre:"queso",precio:1400},
    {nombre:"cerveza",precio:1600}
];

export const usePosStore =  ()=>{
    const [firstState, setFirstState] = useState({
        cliente: "",
        sugerencia: [],
        productoSelecionado: [],
        cantidad: 1,
        carrito :[],
        mostrarResumen:false,
        ventaResumen:null,
        pagos:[
            {metodo:"transferencia", monto:0},
            {metodo:"efectivo", monto:0},
            {metodo:"tarjeta", monto:0}
        ]

    });
//calculos necesario para venta
const {carrito,pagos} = state;
const total = useMemo(()=> carrito.reduce((a,b) => a + b.precio * b.cantidad,0),[carrito])//la base del use memo ba a ser cuando carrito cambie asi evitamos realizar calculos inecesarios
const montoPagado = useMemo(()=> pagos.reduce((a,b) => a + Number(b.monto),0),[pagos]);
const montoFaltante = total-montoPagado;

//acciones a realizar para gestionar los datos;
const updateState = (updates) => setFirstState(prev => ({ ...prev, ...updates }));
const state =firstState;

 const manejarCliente =  useCallback((value)=>{
    const sugerencias = value.length >0
    ?clientMock.filter(c => c.toLowerCase().includes(value.toLowerCase()))
    :[];
    updateState({cliente:value,sugerencias});
 },[]);
 const agregarProducto = useCallback(() => {
    if (state.productoSeleccionado.length <= 1) {
      alert("Debe seleccionar un producto");
      return;
    } const producto = productsMock.find(p => 
        p.nombre.toLowerCase() === state.productoSeleccionado.toLowerCase()
      );
      if (producto && state.cantidad > 0) {
        updateState({
          carrito: [...state.carrito, { ...producto, cantidad: state.cantidad }],
          productoSeleccionado: "",
          cantidad: 1
        });
    }
}, [state.productoSelecionado, state.cantidad]);

// ... otras acciones

return {
  ...state,
  total,
  montoPagado,
  montoFaltante,
  manejarCliente,
  agregarProducto,
  // ... otras acciones exportadas
};
};

  






